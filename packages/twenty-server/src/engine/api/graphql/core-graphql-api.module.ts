import { Module } from '@nestjs/common';

import { ScalarsExplorerService } from 'src/engine/api/graphql/services/scalars-explorer.service';
import { WorkspaceResolverBuilderModule } from 'src/engine/api/graphql/workspace-resolver-builder/workspace-resolver-builder.module';
import { WorkspaceSchemaBuilderModule } from 'src/engine/api/graphql/workspace-schema-builder/workspace-schema-builder.module';
import { MetadataEngineModule } from 'src/engine/metadata-modules/metadata-engine.module';
import { WorkspaceMetadataVersionModule } from 'src/engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';

import { WorkspaceSchemaFactory } from './workspace-schema.factory';

@Module({
  imports: [
    // TODO: Seems like it's breaking /metadata query and mutation arguments
    // we should investigate this issue
    // GraphQLModule.forRootAsync<YogaDriverConfig>({
    //   driver: YogaDriver,
    //   imports: [CoreEngineModule, GraphQLConfigModule],
    //   useClass: GraphQLConfigService,
    // }),
    MetadataEngineModule,
    WorkspaceSchemaBuilderModule,
    WorkspaceResolverBuilderModule,
    WorkspaceCacheStorageModule,
    WorkspaceMetadataVersionModule,
  ],
  providers: [WorkspaceSchemaFactory, ScalarsExplorerService],
  exports: [WorkspaceSchemaFactory],
})
export class CoreGraphQLApiModule {}
