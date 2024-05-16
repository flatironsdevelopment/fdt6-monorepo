import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueName } from '../../../constants/queues';
import { ErrorReportingService } from '../../reporting/error-reporting.service';

export enum MailingJobName {
  SendEmail = 'send-email',
}

@Processor(QueueName.Mailing)
export class MailingProcessor {
  private readonly logger = new Logger(MailingProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly errorReporting: ErrorReportingService,
  ) {}

  @Process(MailingJobName.SendEmail)
  handleSendEmail(job: Job<ISendMailOptions>) {
    try {
      this.mailerService.sendMail(job.data);
      this.logger.log(`Email sent to ${job.data.to}`);
    } catch (error: any) {
      this.errorReporting.captureException(error);
    }
  }
}
