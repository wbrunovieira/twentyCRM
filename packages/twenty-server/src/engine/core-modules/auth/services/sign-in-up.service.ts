import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import FileType from 'file-type';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import {
  PASSWORD_REGEX,
  compareHash,
  hashPassword,
} from 'src/engine/core-modules/auth/auth.util';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
import { OnboardingService } from 'src/engine/core-modules/onboarding/onboarding.service';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { User } from 'src/engine/core-modules/user/user.entity';
import {
  Workspace,
  WorkspaceActivationStatus,
} from 'src/engine/core-modules/workspace/workspace.entity';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { getImageBufferFromUrl } from 'src/utils/image';

export type SignInUpServiceInput = {
  email: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  workspaceInviteHash?: string | null;
  picture?: string | null;
  fromSSO: boolean;
};

@Injectable()
// eslint-disable-next-line @nx/workspace-inject-workspace-repository
export class SignInUpService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly onboardingService: OnboardingService,
    private readonly httpService: HttpService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async signInUp({
    email,
    workspaceInviteHash,
    password,
    firstName,
    lastName,
    picture,
    fromSSO,
  }: SignInUpServiceInput) {
    if (!firstName) firstName = '';
    if (!lastName) lastName = '';

    if (!email) {
      throw new AuthException(
        'Email is required',
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    if (password) {
      const isPasswordValid = PASSWORD_REGEX.test(password);

      if (!isPasswordValid) {
        throw new AuthException(
          'Password too weak',
          AuthExceptionCode.INVALID_INPUT,
        );
      }
    }

    const passwordHash = password ? await hashPassword(password) : undefined;

    const existingUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['defaultWorkspace'],
    });

    if (existingUser && !fromSSO) {
      const isValid = await compareHash(
        password || '',
        existingUser.passwordHash,
      );

      if (!isValid) {
        throw new AuthException(
          'Wrong password',
          AuthExceptionCode.FORBIDDEN_EXCEPTION,
        );
      }
    }

    if (workspaceInviteHash) {
      return await this.signInUpOnExistingWorkspace({
        email,
        passwordHash,
        workspaceInviteHash,
        firstName,
        lastName,
        picture,
        existingUser,
      });
    }
    if (!existingUser) {
      return await this.signUpOnNewWorkspace({
        email,
        passwordHash,
        firstName,
        lastName,
        picture,
      });
    }

    return existingUser;
  }

  private async signInUpOnExistingWorkspace({
    email,
    passwordHash,
    workspaceInviteHash,
    firstName,
    lastName,
    picture,
    existingUser,
  }: {
    email: string;
    passwordHash: string | undefined;
    workspaceInviteHash: string;
    firstName: string;
    lastName: string;
    picture: SignInUpServiceInput['picture'];
    existingUser: User | null;
  }) {
    const workspace = await this.workspaceRepository.findOneBy({
      inviteHash: workspaceInviteHash,
    });

    if (!workspace) {
      throw new AuthException(
        'Invit hash is invalid',
        AuthExceptionCode.FORBIDDEN_EXCEPTION,
      );
    }

    if (!(workspace.activationStatus === WorkspaceActivationStatus.ACTIVE)) {
      throw new AuthException(
        'Workspace is not ready to welcome new members',
        AuthExceptionCode.FORBIDDEN_EXCEPTION,
      );
    }

    if (existingUser) {
      const updatedUser = await this.userWorkspaceService.addUserToWorkspace(
        existingUser,
        workspace,
      );

      return Object.assign(existingUser, updatedUser);
    }

    const imagePath = await this.uploadPicture(picture, workspace.id);

    const userToCreate = this.userRepository.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      defaultAvatarUrl: imagePath,
      canImpersonate: false,
      passwordHash,
      defaultWorkspace: workspace,
    });

    const user = await this.userRepository.save(userToCreate);

    await this.userWorkspaceService.create(user.id, workspace.id);
    await this.userWorkspaceService.createWorkspaceMember(workspace.id, user);

    await this.onboardingService.setOnboardingConnectAccountPending({
      userId: user.id,
      workspaceId: workspace.id,
      value: true,
    });

    if (firstName === '' && lastName === '') {
      await this.onboardingService.setOnboardingCreateProfilePending({
        userId: user.id,
        workspaceId: workspace.id,
        value: true,
      });
    }

    return user;
  }

  private async signUpOnNewWorkspace({
    email,
    passwordHash,
    firstName,
    lastName,
    picture,
  }: {
    email: string;
    passwordHash: string | undefined;
    firstName: string;
    lastName: string;
    picture: SignInUpServiceInput['picture'];
  }) {
    if (this.environmentService.get('IS_SIGN_UP_DISABLED')) {
      throw new AuthException(
        'Sign up is disabled',
        AuthExceptionCode.FORBIDDEN_EXCEPTION,
      );
    }

    const workspaceToCreate = this.workspaceRepository.create({
      displayName: '',
      domainName: '',
      inviteHash: v4(),
      activationStatus: WorkspaceActivationStatus.PENDING_CREATION,
    });

    const workspace = await this.workspaceRepository.save(workspaceToCreate);

    const imagePath = await this.uploadPicture(picture, workspace.id);

    const userToCreate = this.userRepository.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      defaultAvatarUrl: imagePath,
      canImpersonate: false,
      passwordHash,
      defaultWorkspace: workspace,
    });

    const user = await this.userRepository.save(userToCreate);

    await this.userWorkspaceService.create(user.id, workspace.id);

    await this.onboardingService.setOnboardingConnectAccountPending({
      userId: user.id,
      workspaceId: workspace.id,
      value: true,
    });

    if (firstName === '' && lastName === '') {
      await this.onboardingService.setOnboardingCreateProfilePending({
        userId: user.id,
        workspaceId: workspace.id,
        value: true,
      });
    }

    await this.onboardingService.setOnboardingInviteTeamPending({
      workspaceId: workspace.id,
      value: true,
    });

    return user;
  }

  async uploadPicture(
    picture: string | null | undefined,
    workspaceId: string,
  ): Promise<string | undefined> {
    if (!picture) {
      return;
    }

    const buffer = await getImageBufferFromUrl(
      picture,
      this.httpService.axiosRef,
    );

    const type = await FileType.fromBuffer(buffer);

    const { paths } = await this.fileUploadService.uploadImage({
      file: buffer,
      filename: `${v4()}.${type?.ext}`,
      mimeType: type?.mime,
      fileFolder: FileFolder.ProfilePicture,
      workspaceId,
    });

    return paths[0];
  }
}
