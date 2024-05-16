import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QueueName } from '../../../constants/queues';
import { SmsDataType, SmsType } from './sms.constants';
import { ISendSmsOptions, SmsJobName } from './sms.processor';

@Injectable()
export class SmsService {
  constructor(
    @InjectQueue(QueueName.Sms)
    private readonly smsQueue: Queue<ISendSmsOptions>,
  ) {}

  getMessage(type: SmsType, code: string) {
    switch (type) {
      case SmsType.ACCOUNT_CREATED_CODE:
        return `Your verification code is ${code}`;
      case SmsType.VERIFY_PHONE_NUMBER_CODE:
        return `Your verification code is ${code}`;
      case SmsType.AUTHENTICATION_CODE:
        return `Your verification code is ${code}`;
      case SmsType.FORGOT_PASSWORD_CODE:
        return `Your verification code is ${code}`;
      case SmsType.RESEND_SMS_CODE:
        return `Your verification code is ${code}`;
      case SmsType.UPDATE_PHONE_NUMBER_CODE:
        return `Your verification code is ${code}`;
      default:
        return '';
    }
  }

  async sendVerificationCode(
    options: SmsDataType[SmsType.ACCOUNT_CREATED_CODE],
  ) {
    await this.smsQueue.add(SmsJobName.SendSms, {
      to: options.phone,
      message: this.getMessage(SmsType.ACCOUNT_CREATED_CODE, options.code),
    });
  }
}
