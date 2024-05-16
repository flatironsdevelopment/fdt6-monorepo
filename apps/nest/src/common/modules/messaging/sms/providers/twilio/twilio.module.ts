import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { ReportingModule } from '../../../../reporting/reporting.module';
import { TwilioProviderService } from './twilio.service';

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ReportingModule,
  ],
  providers: [TwilioProviderService],
})
export class TwilioProviderModule {}
