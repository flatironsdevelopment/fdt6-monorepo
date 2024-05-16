import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueName } from '../../../constants/queues';
import { ReportingModule } from '../../reporting/reporting.module';
import { MailListener } from './mail.listener';
import { MailingProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.Mailing,
    }),
    ReportingModule,
  ],
  providers: [MailService, MailListener, MailingProcessor],
  exports: [MailService],
})
export class MailModule {}
