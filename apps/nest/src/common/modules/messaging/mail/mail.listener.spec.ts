import { TestBed, faker } from 'testing';
import { SendEmailEvent } from '../../../constants/events';
import { MailTemplates } from './mail.constants';
import { MailListener } from './mail.listener';
import { MailService } from './mail.service';

describe('MailListener', () => {
  let underTest: MailListener;
  let mailService: MailService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MailListener)
      .mock(MailService)
      .using({
        sendEmail: jest.fn(),
        sendVerifyAccountEmail: jest.fn(),
      })
      .compile();

    underTest = unit;
    mailService = unitRef.get(MailService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(mailService).toBeDefined();
  });

  describe('handleSendEmailEvent', () => {
    it('should send email', async () => {
      const email = faker.create.internet.email();
      const code = faker.create.string.alphanumeric();

      expect(mailService.sendVerifyAccountEmail).not.toHaveBeenCalled();

      await underTest.handleSendEmailEvent(
        new SendEmailEvent({
          type: MailTemplates.ACCOUNT_CREATED,
          options: {
            email,
            code,
          },
        }),
      );

      expect(mailService.sendVerifyAccountEmail).toHaveBeenCalledWith({
        email,
        code,
      });
    });
  });
});
