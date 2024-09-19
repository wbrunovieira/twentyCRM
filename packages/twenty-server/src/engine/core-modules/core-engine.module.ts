import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ActorModule } from 'src/engine/core-modules/actor/actor.module';
import { AISQLQueryModule } from 'src/engine/core-modules/ai-sql-query/ai-sql-query.module';
import { AppTokenModule } from 'src/engine/core-modules/app-token/app-token.module';
import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { BillingModule } from 'src/engine/core-modules/billing/billing.module';
import { TimelineCalendarEventModule } from 'src/engine/core-modules/calendar/timeline-calendar-event.module';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { HealthModule } from 'src/engine/core-modules/health/health.module';
import { TimelineMessagingModule } from 'src/engine/core-modules/messaging/timeline-messaging.module';
import { OpenApiModule } from 'src/engine/core-modules/open-api/open-api.module';
import { PostgresCredentialsModule } from 'src/engine/core-modules/postgres-credentials/postgres-credentials.module';
import { UserModule } from 'src/engine/core-modules/user/user.module';
import { WorkflowTriggerApiModule } from 'src/engine/core-modules/workflow/workflow-trigger-api.module';
import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';
import { EnvironmentModule } from 'src/engine/core-modules/environment/environment.module';
import { FileStorageModule } from 'src/engine/core-modules/file-storage/file-storage.module';
import { fileStorageModuleFactory } from 'src/engine/core-modules/file-storage/file-storage.module-factory';
import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { LoggerModule } from 'src/engine/core-modules/logger/logger.module';
import { loggerModuleFactory } from 'src/engine/core-modules/logger/logger.module-factory';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { messageQueueModuleFactory } from 'src/engine/core-modules/message-queue/message-queue.module-factory';
import { ExceptionHandlerModule } from 'src/engine/core-modules/exception-handler/exception-handler.module';
import { exceptionHandlerModuleFactory } from 'src/engine/core-modules/exception-handler/exception-handler.module-factory';
import { EmailModule } from 'src/engine/core-modules/email/email.module';
import { emailModuleFactory } from 'src/engine/core-modules/email/email.module-factory';
import { CaptchaModule } from 'src/engine/core-modules/captcha/captcha.module';
import { captchaModuleFactory } from 'src/engine/core-modules/captcha/captcha.module-factory';
import { CacheStorageModule } from 'src/engine/core-modules/cache-storage/cache-storage.module';
import { LLMChatModelModule } from 'src/engine/core-modules/llm-chat-model/llm-chat-model.module';
import { llmChatModelModuleFactory } from 'src/engine/core-modules/llm-chat-model/llm-chat-model.module-factory';
import { LLMTracingModule } from 'src/engine/core-modules/llm-tracing/llm-tracing.module';
import { llmTracingModuleFactory } from 'src/engine/core-modules/llm-tracing/llm-tracing.module-factory';
import { ServerlessModule } from 'src/engine/core-modules/serverless/serverless.module';
import { serverlessModuleFactory } from 'src/engine/core-modules/serverless/serverless-module.factory';
import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';

import { FileModule } from './file/file.module';
import { ClientConfigModule } from './client-config/client-config.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    HealthModule,
    AnalyticsModule,
    AuthModule,
    BillingModule,
    ClientConfigModule,
    FeatureFlagModule,
    FileModule,
    OpenApiModule,
    AppTokenModule,
    TimelineMessagingModule,
    TimelineCalendarEventModule,
    UserModule,
    WorkspaceModule,
    AISQLQueryModule,
    PostgresCredentialsModule,
    WorkflowTriggerApiModule,
    WorkspaceEventEmitterModule,
    ActorModule,
    EnvironmentModule.forRoot({}),
    FileStorageModule.forRootAsync({
      useFactory: fileStorageModuleFactory,
      inject: [EnvironmentService],
    }),
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [EnvironmentService],
    }),
    MessageQueueModule.registerAsync({
      useFactory: messageQueueModuleFactory,
      inject: [EnvironmentService],
    }),
    ExceptionHandlerModule.forRootAsync({
      useFactory: exceptionHandlerModuleFactory,
      inject: [EnvironmentService, HttpAdapterHost],
    }),
    EmailModule.forRoot({
      useFactory: emailModuleFactory,
      inject: [EnvironmentService],
    }),
    CaptchaModule.forRoot({
      useFactory: captchaModuleFactory,
      inject: [EnvironmentService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CacheStorageModule,
    LLMChatModelModule.forRoot({
      useFactory: llmChatModelModuleFactory,
      inject: [EnvironmentService],
    }),
    LLMTracingModule.forRoot({
      useFactory: llmTracingModuleFactory,
      inject: [EnvironmentService],
    }),
    ServerlessModule.forRootAsync({
      useFactory: serverlessModuleFactory,
      inject: [EnvironmentService, FileStorageService],
    }),
  ],
  exports: [
    AnalyticsModule,
    AuthModule,
    FeatureFlagModule,
    TimelineMessagingModule,
    TimelineCalendarEventModule,
    UserModule,
    WorkspaceModule,
  ],
})
export class CoreEngineModule {}
