import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { TestBed, faker } from 'testing';
import { QueueName } from '../../../constants/queues';
import { SmsType } from './sms.constants';
import { SmsJobName } from './sms.processor';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let underTest: SmsService;
  let smsQueue: Queue;

  beforeEach(async () => {
    const queueToken = getQueueToken(QueueName.Sms);
    const { unit, unitRef } = TestBed.create(SmsService)
      .mock(queueToken)
      .using({
        add: jest.fn(),
      })
      .compile();

    underTest = unit;
    smsQueue = unitRef.get(queueToken);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(smsQueue).toBeDefined();
  });

  describe('getMessage', () => {
    it('should return correct message for ACCOUNT_CREATED_CODE', () => {
      const type = SmsType.ACCOUNT_CREATED_CODE;
      const code = faker.create.string.uuid();

      const message = underTest.getMessage(type, code);

      expect(message).toEqual(`Your verification code is ${code}`);
    });

    it('should return an empty string for unknown SmsType', () => {
      const type = 'UNKNOWN_TYPE' as SmsType;
      const code = faker.create.string.uuid();

      const message = underTest.getMessage(type, code);

      expect(message).toEqual('');
    });
  });

  describe('sendVerificationCode', () => {
    it('should add SendSms job to queue with correct data for ACCOUNT_CREATED_CODE', async () => {
      jest
        .spyOn(underTest, 'getMessage')
        .mockReturnValue('Your verification code is 123456');

      const options = {
        phone: faker.create.phone.number(),
        code: faker.create.string.uuid(),
      };

      await underTest.sendVerificationCode(options);

      expect(smsQueue.add).toHaveBeenCalledWith(SmsJobName.SendSms, {
        to: options.phone,
        message: 'Your verification code is 123456',
      });
    });
  });
});
