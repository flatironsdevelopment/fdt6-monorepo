import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConfiguration } from './common/database';
import { DatabaseProviders } from './common/database/constants';
import { AuthProviderModule } from './common/modules/auth/auth-provider.module';
import { AuthProviderName } from './common/modules/auth/constants';
import { MessagingModule } from './common/modules/messaging/messaging.module';
import { ReportingModule } from './common/modules/reporting/reporting.module';
import { UserModule } from './common/modules/user/user.module';
import { getRedisConfig } from './common/utils/config';
import { HealthModule } from './health/health.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      exclude: ['/v/(.*)'],
      serveRoot: '/public',
    }),
    ...getDatabaseConfiguration(DatabaseProviders.POSTGRES),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL');
        const redis = getRedisConfig(redisUrl);
        return {
          redis,
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        url: process.env['SMTP_URL'],
      },
      defaults: {
        from: process.env['SMTP_FROM'],
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
      preview: !!process.env['PREVIEW_EMAILS'],
    }),
    UserModule,
    AuthProviderModule.forRoot(AuthProviderName.COGNITO),
    AuthModule,
    MessagingModule,
    ReportingModule,
    HealthModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
