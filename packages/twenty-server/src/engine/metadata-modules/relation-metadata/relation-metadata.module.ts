import { Module } from '@nestjs/common';

import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { RelationMetadataGraphqlApiExceptionInterceptor } from 'src/engine/metadata-modules/relation-metadata/interceptors/relation-metadata-graphql-api-exception.interceptor';
import { RelationMetadataResolver } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.resolver';
import { WorkspaceMetadataVersionModule } from 'src/engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module';
import { WorkspaceMigrationModule } from 'src/engine/metadata-modules/workspace-migration/workspace-migration.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration-runner/workspace-migration-runner.module';

import { RelationMetadataEntity } from './relation-metadata.entity';
import { RelationMetadataService } from './relation-metadata.service';

import { CreateRelationInput } from './dtos/create-relation.input';
import { RelationMetadataDTO } from './dtos/relation-metadata.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature(
          [RelationMetadataEntity, FieldMetadataEntity],
          'metadata',
        ),
        ObjectMetadataModule,
        FieldMetadataModule,
        WorkspaceMigrationRunnerModule,
        WorkspaceMigrationModule,
        WorkspaceMetadataVersionModule,
      ],
      services: [RelationMetadataService],
      resolvers: [
        {
          EntityClass: RelationMetadataEntity,
          DTOClass: RelationMetadataDTO,
          ServiceClass: RelationMetadataService,
          CreateDTOClass: CreateRelationInput,
          pagingStrategy: PagingStrategies.CURSOR,
          create: { many: { disabled: true } },
          update: { disabled: true },
          delete: { disabled: true },
          guards: [JwtAuthGuard],
          interceptors: [RelationMetadataGraphqlApiExceptionInterceptor],
        },
      ],
    }),
  ],
  providers: [RelationMetadataService, RelationMetadataResolver],
  exports: [RelationMetadataService],
})
export class RelationMetadataModule {}
