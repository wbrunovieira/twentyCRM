import { Logger } from '@nestjs/common';

import isEmpty from 'lodash.isempty';
import { Command, CommandRunner, Option } from 'nest-commander';

import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { WorkspaceHealthService } from 'src/engine/workspace-manager/workspace-health/workspace-health.service';
import { WorkspaceStatusService } from 'src/engine/workspace-manager/workspace-status/services/workspace-status.service';
import { WorkspaceSyncMetadataService } from 'src/engine/workspace-manager/workspace-sync-metadata/workspace-sync-metadata.service';

import { SyncWorkspaceLoggerService } from './services/sync-workspace-logger.service';

// TODO: implement dry-run
interface RunWorkspaceMigrationsOptions {
  dryRun?: boolean;
  force?: boolean;
  workspaceId?: string;
}

@Command({
  name: 'workspace:sync-metadata',
  description: 'Sync metadata',
})
export class SyncWorkspaceMetadataCommand extends CommandRunner {
  private readonly logger = new Logger(SyncWorkspaceMetadataCommand.name);

  constructor(
    private readonly workspaceSyncMetadataService: WorkspaceSyncMetadataService,
    private readonly workspaceHealthService: WorkspaceHealthService,
    private readonly dataSourceService: DataSourceService,
    private readonly syncWorkspaceLoggerService: SyncWorkspaceLoggerService,
    private readonly workspaceStatusService: WorkspaceStatusService,
  ) {
    super();
  }

  async run(
    _passedParam: string[],
    options: RunWorkspaceMigrationsOptions,
  ): Promise<void> {
    // TODO: re-implement load index from workspaceService, this is breaking the logger
    let workspaceIds = options.workspaceId ? [options.workspaceId] : [];

    if (isEmpty(workspaceIds)) {
      const activeWorkspaceIds =
        await this.workspaceStatusService.getActiveWorkspaceIds();

      workspaceIds = activeWorkspaceIds;
      this.logger.log(
        `Attempting to sync ${activeWorkspaceIds.length} workspaces.`,
      );
    }

    let count = 1;

    const errorsDuringSync: string[] = [];

    for (const workspaceId of workspaceIds) {
      this.logger.log(
        `Running workspace sync for workspace: ${workspaceId} (${count} out of ${workspaceIds.length})`,
      );
      count++;
      try {
        const issues =
          await this.workspaceHealthService.healthCheck(workspaceId);

        // Security: abort if there are issues.
        if (issues.length > 0) {
          if (!options.force) {
            this.logger.error(
              `Workspace contains ${issues.length} issues, aborting.`,
            );

            this.logger.log(
              'If you want to force the migration, use --force flag',
            );
            this.logger.log(
              'Please use `workspace:health` command to check issues and fix them before running this command.',
            );

            continue;
          }

          this.logger.warn(
            `Workspace contains ${issues.length} issues, sync has been forced.`,
          );
        }
      } catch (error) {
        if (!options.force) {
          throw error;
        }

        this.logger.warn(
          `Workspace health check failed with error, but sync has been forced.`,
          error,
        );
      }

      try {
        const dataSourceMetadata =
          await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
            workspaceId,
          );

        const { storage, workspaceMigrations } =
          await this.workspaceSyncMetadataService.synchronize(
            {
              workspaceId,
              dataSourceId: dataSourceMetadata.id,
            },
            { applyChanges: !options.dryRun },
          );

        if (options.dryRun) {
          await this.syncWorkspaceLoggerService.saveLogs(
            workspaceId,
            storage,
            workspaceMigrations,
          );
        }
      } catch (error) {
        errorsDuringSync.push(
          `Failed to synchronize workspace ${workspaceId}: ${error.message}`,
        );

        continue;
      }
    }

    this.logger.log(
      `Finished synchronizing all active workspaces (${
        workspaceIds.length
      } workspaces). ${
        errorsDuringSync.length > 0
          ? 'Errors during sync:\n' + errorsDuringSync.join('.\n')
          : ''
      }`,
    );
  }

  @Option({
    flags: '-w, --workspace-id [workspace_id]',
    description: 'workspace id',
    required: false,
  })
  parseWorkspaceId(value: string): string {
    return value;
  }

  @Option({
    flags: '-d, --dry-run',
    description: 'Dry run without applying changes',
    required: false,
  })
  dryRun(): boolean {
    return true;
  }

  @Option({
    flags: '-f, --force',
    description: 'Force migration',
    required: false,
  })
  force(): boolean {
    return true;
  }
}
