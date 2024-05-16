import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EventOperation,
  SendEmailEvent,
  SendSmsEvent,
} from '../../constants/events';
import { SendEmailDto } from './dto/email.dto';
import { SendSmsDto } from './dto/sms.dto';

@Injectable()
export class MessagingService {
  constructor(private readonly eventEmitter2: EventEmitter2) {}

  async sendSms(data: SendSmsDto) {
    this.eventEmitter2.emit(
      EventOperation.SEND_SMS,
      new SendSmsEvent({
        type: data.template,
        options: {
          ...data.data,
          phone: data.to,
        },
      }),
    );
  }

  async sendEmail(data: SendEmailDto) {
    this.eventEmitter2.emit(
      EventOperation.SEND_MAIL,
      new SendEmailEvent({
        type: data.template,
        options: {
          ...data.data,
          email: data.to,
        },
      }),
    );
  }
}
