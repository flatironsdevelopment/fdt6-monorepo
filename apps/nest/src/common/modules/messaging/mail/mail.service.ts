import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { QueueName } from '../../../constants/queues';
import {
  EmailTemplateSubject,
  MailDataType,
  MailTemplates,
} from './mail.constants';
import { MailingJobName } from './mail.processor';

@Injectable({
  scope: Scope.REQUEST,
})
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(QueueName.Mailing)
    private readonly mailingQueue: Queue<ISendMailOptions>,
  ) {}

  async sendEmail<T extends MailTemplates>(
    to: string | string[],
    subject: string,
    body: MailDataType[T],
    from: string,
    template: T,
  ) {
    await this.mailingQueue.add(MailingJobName.SendEmail, {
      to: to,
      from: from,
      subject: subject,
      template: template,
      context: {
        ...body,
        title: subject,
        assets: `${this.configService.get('HOST_URL')}/public`,
      },
    });
    this.logger.log(
      `Email to "${to}" with subject "${subject}" added to the queue`,
    );
  }

  async sendOrganizationInvitationEmail({
    email,
    link,
    organizationName,
  }: MailDataType[MailTemplates.ORGANIZATION_INVITATION]) {
    const from = this.configService.get<string>('SMTP_FROM');
    const template = MailTemplates.ORGANIZATION_INVITATION;
    const subject = EmailTemplateSubject[template];

    await this.sendEmail(
      email,
      subject,
      {
        email,
        link,
        organizationName,
      },
      from,
      template,
    );
  }

  async sendVerifyAccountEmail({
    email,
    code,
  }: MailDataType[MailTemplates.ACCOUNT_CREATED]) {
    const from = this.configService.get<string>('SMTP_FROM');
    const template = MailTemplates.ACCOUNT_CREATED;
    const subject = EmailTemplateSubject[template];

    await this.sendEmail(
      email,
      subject,
      {
        email,
        code,
      },
      from,
      template,
    );
  }
}
