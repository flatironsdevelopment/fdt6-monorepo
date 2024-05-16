import {
  MailDataType,
  MailTemplates,
} from '../modules/messaging/mail/mail.constants';
import { SmsDataType, SmsType } from '../modules/messaging/sms/sms.constants';

export enum EventOperation {
  SEND_MAIL = 'send.mail',
  SEND_SMS = 'send.sms',
  USER_CREATED_WITH_ORGANIZATION = 'user.created.organization',
}

export class SendEmailEvent<T extends MailTemplates> {
  type: T;
  options: MailDataType[T];

  constructor({ type, options }: { type: T; options: MailDataType[T] }) {
    this.type = type;
    this.options = options;
  }
}

export class SendSmsEvent<T extends SmsType> {
  type: T;
  options: SmsDataType[T];

  constructor({ type, options }: { type: T; options: SmsDataType[T] }) {
    this.type = type;
    this.options = options;
  }
}

export class UserCreatedWithOrganizationEvent {
  userEmail: string;
  organizationName: string;
  userId: string;

  constructor({
    userEmail,
    userId,
    organizationName,
  }: {
    userEmail: string;
    organizationName: string;
    userId: string;
  }) {
    this.userEmail = userEmail;
    this.organizationName = organizationName;
    this.userId = userId;
  }
}
