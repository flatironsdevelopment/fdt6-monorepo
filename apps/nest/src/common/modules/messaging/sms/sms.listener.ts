import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventOperation, SendSmsEvent } from '../../../constants/events';
import { SmsType } from './sms.constants';
import { SmsService } from './sms.service';

@Injectable()
export class SmsListener {
  constructor(private readonly smsService: SmsService) {}

  @OnEvent(EventOperation.SEND_SMS)
  handleSendSmsEvent<T extends SmsType>(event: SendSmsEvent<T>) {
    switch (event.type) {
      case SmsType.ACCOUNT_CREATED_CODE:
      case SmsType.VERIFY_PHONE_NUMBER_CODE:
      case SmsType.AUTHENTICATION_CODE:
      case SmsType.FORGOT_PASSWORD_CODE:
      case SmsType.RESEND_SMS_CODE:
      case SmsType.UPDATE_PHONE_NUMBER_CODE:
        this.smsService.sendVerificationCode(event.options);
        break;
      default:
        break;
    }
  }
}
