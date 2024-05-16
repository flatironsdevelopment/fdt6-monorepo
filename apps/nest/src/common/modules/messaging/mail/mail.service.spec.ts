import { getQueueToken } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { TestBed, faker } from 'testing';
import { createConfigMock } from '../../../../../test/utils/config';
import { QueueName } from '../../../constants/queues';
import { EmailTemplateSubject, MailTemplates } from './mail.constants';
import { MailService } from './mail.service';

describe('MailService', () => {
  let underTest: MailService;
  let configService: ConfigService;
  let mailingQueue: Queue;
  let fromEmail: string;

  beforeEach(async () => {
    fromEmail = faker.create.internet.email();

    const queueToken = getQueueToken(QueueName.Mailing);
    const { unit, unitRef } = TestBed.create(MailService)
      .mock(ConfigService)
      .using(
        createConfigMock({
          SMTP_FROM: fromEmail,
          SMTP_URL: faker.create.internet.url(),
        }),
      )
      .mock(queueToken)
      .using({
        add: jest.fn(),
      })
      .compile();

    underTest = unit;
    configService = unitRef.get(ConfigService);
    mailingQueue = unitRef.get(queueToken);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(configService).toBeDefined();
    expect(mailingQueue).toBeDefined();
  });

  it('should send email', async () => {
    const to = faker.create.internet.email();
    const code = faker.create.string.uuid();
    const data = {
      email: to,
      code,
    };

    const spy = jest.spyOn(underTest, 'sendEmail');

    expect(spy).not.toHaveBeenCalled();
    await underTest.sendVerifyAccountEmail(data);
    expect(spy).toHaveBeenCalled();
  });

  describe('sendVerifyAccountEmail', () => {
    it('should send verify account email', async () => {
      const email = faker.create.internet.email();
      const code = faker.create.string.uuid();
      const subject = EmailTemplateSubject[MailTemplates.ACCOUNT_CREATED];
      const template = MailTemplates.ACCOUNT_CREATED;
      const context = {
        email,
        code,
      };

      const spy = jest.spyOn(underTest, 'sendEmail');

      expect(spy).not.toHaveBeenCalled();

      await underTest.sendVerifyAccountEmail({
        email,
        code,
      });

      expect(spy).toHaveBeenCalledWith(
        email,
        subject,
        context,
        fromEmail,
        template,
      );
    });
  });
});
