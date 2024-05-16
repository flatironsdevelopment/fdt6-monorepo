import { TestBed, faker } from 'testing';
import { SendEmailDto } from './dto/email.dto';
import { SendSmsDto } from './dto/sms.dto';
import { MailTemplates } from './mail/mail.constants';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { SmsType } from './sms/sms.constants';

describe('MessagingController', () => {
  let underTest: MessagingController;
  let messagingService: MessagingService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MessagingController)
      .mock(MessagingService)
      .using({
        sendSms: jest.fn(),
        sendEmail: jest.fn(),
      })
      .compile();

    underTest = unit;
    messagingService = unitRef.get(MessagingService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(messagingService).toBeDefined();
  });

  describe('sendSms', () => {
    it('should call sendSms method with provided SendSmsDto', async () => {
      const sendSmsDto: SendSmsDto = {
        to: faker.create.phone.number(),
        template: SmsType.ACCOUNT_CREATED_CODE,
        data: {
          code: faker.create.string.uuid(),
        },
      };

      await underTest.sendSms(sendSmsDto);

      expect(messagingService.sendSms).toHaveBeenCalledWith(sendSmsDto);
    });
  });
  describe('sendEmail', () => {
    it('should call sendEmail method with provided SendSmsDto', async () => {
      const sendSmsDto: SendEmailDto = {
        to: faker.create.phone.number(),
        template: MailTemplates.ACCOUNT_CREATED,
        data: {
          code: faker.create.string.uuid(),
        },
      };

      await underTest.sendEmail(sendSmsDto);

      expect(messagingService.sendEmail).toHaveBeenCalledWith(sendSmsDto);
    });
  });
});
