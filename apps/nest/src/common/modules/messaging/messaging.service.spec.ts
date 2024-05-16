import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestBed, faker } from 'testing';
import {
  EventOperation,
  SendEmailEvent,
  SendSmsEvent,
} from '../../constants/events';
import { SendEmailDto } from './dto/email.dto';
import { SendSmsDto } from './dto/sms.dto';
import { MailTemplates } from './mail/mail.constants';
import { MessagingService } from './messaging.service';
import { SmsType } from './sms/sms.constants';

describe('MessagingService', () => {
  let underTest: MessagingService;
  let emitter: EventEmitter2;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MessagingService)
      .mock(EventEmitter2)
      .using({
        emit: jest.fn(),
      })
      .compile();

    underTest = unit;
    emitter = unitRef.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(emitter).toBeDefined();
  });

  describe('sendSms', () => {
    it('should emit SEND_SMS event with the correct SendSmsEvent payload', async () => {
      const sendSmsDto: SendSmsDto = {
        template: SmsType.ACCOUNT_CREATED_CODE,
        to: faker.create.phone.number(),
        data: {
          code: faker.create.string.uuid(),
        },
      };

      await underTest.sendSms(sendSmsDto);

      expect(emitter.emit).toHaveBeenCalledWith(
        EventOperation.SEND_SMS,
        new SendSmsEvent({
          type: sendSmsDto.template,
          options: {
            ...sendSmsDto.data,
            phone: sendSmsDto.to,
          },
        }),
      );
    });
  });

  describe('sendEmail', () => {
    it('should emit SEND_MAIL event with the correct SendEmailEvent payload', async () => {
      const sendEmailDto: SendEmailDto = {
        template: MailTemplates.ACCOUNT_CREATED,
        to: faker.create.internet.email(),
        data: {
          code: faker.create.string.uuid(),
        },
      };

      await underTest.sendEmail(sendEmailDto);

      expect(emitter.emit).toHaveBeenCalledWith(
        EventOperation.SEND_MAIL,
        new SendEmailEvent({
          type: sendEmailDto.template,
          options: {
            ...sendEmailDto.data,
            email: sendEmailDto.to,
          },
        }),
      );
    });
  });
});
