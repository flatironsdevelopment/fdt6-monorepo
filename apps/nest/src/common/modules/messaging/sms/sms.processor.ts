import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueName } from '../../../constants/queues';
import { ErrorReportingService } from '../../reporting/error-reporting.service';
import { SMSProviderConfig } from './providers/base.interfaces';
import { SmsProviderService } from './providers/sms-provider.service';

export enum SmsJobName {
  SendSms = 'send-sms',
}

export interface ISendSmsOptions {
  to: string;
  message: string;
  config?: SMSProviderConfig;
}

@Processor(QueueName.Sms)
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);

  constructor(
    private readonly smsProviderService: SmsProviderService,
    private readonly errorReporting: ErrorReportingService,
  ) {}

  @Process(SmsJobName.SendSms)
  handleSendSms(job: Job<ISendSmsOptions>) {
    try {
      this.smsProviderService.sendSms(
        job.data.to,
        job.data.message,
        job.data.config,
      );
      this.logger.log(`Sms sent to ${job.data.to}`);
    } catch (error: any) {
      this.errorReporting.captureException(error);
    }
  }
}
