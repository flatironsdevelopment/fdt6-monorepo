import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueName } from '../../../constants/queues';
import { ReportingModule } from '../../reporting/reporting.module';
import { DynamicSMSProviderService } from './providers/dynamic-providers.service';
import { SmsProviderService } from './providers/sms-provider.service';
import { SMSProviderName, SMS_MODULE_CONFIG } from './sms.constants';
import { SmsListener } from './sms.listener';
import { SmsProcessor } from './sms.processor';
import { SmsService } from './sms.service';

@Module({})
export class SmsModule {
  static forRoot(provider: SMSProviderName) {
    return {
      module: SmsModule,
      imports: [
        BullModule.registerQueue({
          name: QueueName.Sms,
        }),
        ReportingModule,
      ],
      providers: [
        SmsService,
        SmsProcessor,
        SmsListener,
        DynamicSMSProviderService,
        SmsProviderService,
        {
          provide: SMS_MODULE_CONFIG,
          useValue: { provider },
        },
      ],
      exports: [
        SmsService,
        DynamicSMSProviderService,
        {
          provide: SMS_MODULE_CONFIG,
          useValue: { provider },
        },
        SmsProviderService,
      ],
    };
  }
}
