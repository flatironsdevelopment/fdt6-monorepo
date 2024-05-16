import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { SMSProviderName } from './sms/sms.constants';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [MailModule, SmsModule.forRoot(SMSProviderName.Twilio)],
  providers: [MessagingService],
  controllers: [MessagingController],
})
export class MessagingModule {}
