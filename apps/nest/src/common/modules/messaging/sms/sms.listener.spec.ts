import { SendSmsEvent } from 'src/common/constants/events';
import { TestBed, faker } from 'testing';
import { SmsType } from './sms.constants';
import { SmsListener } from './sms.listener';
import { SmsService } from './sms.service';

describe('SmsListener', () => {
  let underTest: SmsListener;
  let smsService: SmsService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(SmsListener)
      .mock(SmsService)
      .using({
        sendVerificationCode: jest.fn(),
      })
      .compile();

    underTest = unit;
    smsService = unitRef.get(SmsService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(smsService).toBeDefined();
  });

  it('should send verification code for valid SmsType', () => {
    const mockEvent: SendSmsEvent<SmsType> = {
      type: SmsType.ACCOUNT_CREATED_CODE,
      options: {
        phone: faker.create.phone.number(),
        code: faker.create.string.uuid(),
      },
    };

    underTest.handleSendSmsEvent(mockEvent);

    expect(smsService.sendVerificationCode).toHaveBeenCalledWith(
      mockEvent.options,
    );
  });

  it('should not call sendVerificationCode for unknown SmsType', () => {
    const mockEvent: SendSmsEvent<SmsType> = {
      type: 'UNKNOWN_TYPE' as SmsType,
      options: {
        phone: faker.create.phone.number(),
        code: faker.create.string.uuid(),
      },
    };

    underTest.handleSendSmsEvent(mockEvent);

    expect(smsService.sendVerificationCode).not.toHaveBeenCalled();
  });
});
