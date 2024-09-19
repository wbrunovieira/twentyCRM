import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';

import { existsSync } from 'fs';
import { join } from 'path';

import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';

import { CoreGraphQLApiModule } from 'src/engine/api/graphql/core-graphql-api.module';
import { GraphQLConfigModule } from 'src/engine/api/graphql/graphql-config/graphql-config.module';
import { GraphQLConfigService } from 'src/engine/api/graphql/graphql-config/graphql-config.service';
import { MetadataGraphQLApiModule } from 'src/engine/api/graphql/metadata-graphql-api.module';
import { RestApiModule } from 'src/engine/api/rest/rest-api.module';
import { MessageQueueDriverType } from 'src/engine/core-modules/message-queue/interfaces';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { WorkspaceMetadataVersionModule } from 'src/engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module';
import { GraphQLHydrateRequestFromTokenMiddleware } from 'src/engine/middlewares/graphql-hydrate-request-from-token.middleware';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { ModulesModule } from 'src/modules/modules.module';

import { CoreEngineModule } from './engine/core-modules/core-engine.module';

@Module({
  imports: [
    // Nest.js devtools, use devtools.nestjs.com to debug
    // DevtoolsModule.registerAsync({
    //   useFactory: (environmentService: EnvironmentService) => ({
    //     http: environmentService.get('DEBUG_MODE'),
    //     port: environmentService.get('DEBUG_PORT'),
    //   }),
    //   inject: [EnvironmentService],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [CoreEngineModule, GraphQLConfigModule],
      useClass: GraphQLConfigService,
    }),
    TwentyORMModule,
    // Core engine module, contains all the core modules
    CoreEngineModule,
    // Modules module, contains all business logic modules
    ModulesModule,
    // Needed for the user workspace middleware
    WorkspaceMetadataVersionModule,
    // Api modules
    CoreGraphQLApiModule,
    MetadataGraphQLApiModule,
    RestApiModule,
    // Conditional modules
    ...AppModule.getConditionalModules(),
  ],
})
export class AppModule {
  private static getConditionalModules(): DynamicModule[] {
    const modules: DynamicModule[] = [];
    const frontPath = join(__dirname, '..', 'front');

    if (existsSync(frontPath)) {
      modules.push(
        ServeStaticModule.forRoot({
          rootPath: frontPath,
        }),
      );
    }

    // Messaque Queue explorer only for sync driver
    // Maybe we don't need to conditionaly register the explorer, because we're creating a jobs module
    // that will expose classes that are only used in the queue worker
    if (process.env.MESSAGE_QUEUE_TYPE === MessageQueueDriverType.Sync) {
      modules.push(MessageQueueModule.registerExplorer());
    }

    return modules;
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GraphQLHydrateRequestFromTokenMiddleware)
      .forRoutes({ path: 'graphql', method: RequestMethod.ALL });

    consumer
      .apply(GraphQLHydrateRequestFromTokenMiddleware)
      .forRoutes({ path: 'metadata', method: RequestMethod.ALL });
  }
}
