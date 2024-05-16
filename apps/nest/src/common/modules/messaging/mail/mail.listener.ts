import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventOperation, SendEmailEvent } from '../../../constants/events';
import { MailDataType, MailTemplates } from './mail.constants';
import { MailService } from './mail.service';

@Injectable()
export class MailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(EventOperation.SEND_MAIL)
  handleSendEmailEvent<T extends MailTemplates>(event: SendEmailEvent<T>) {
    switch (event.type) {
      case MailTemplates.ACCOUNT_CREATED:
      case MailTemplates.RESEND_CODE:
        this.mailService.sendVerifyAccountEmail(
          event.options as MailDataType[MailTemplates.ACCOUNT_CREATED],
        );
        break;
      case MailTemplates.ORGANIZATION_INVITATION:
        this.mailService.sendOrganizationInvitationEmail(
          event.options as MailDataType[MailTemplates.ORGANIZATION_INVITATION],
        );
        break;
      default:
        break;
    }
  }
}
