import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { TestBed, faker } from 'testing';
import { createConfigMock } from '../../../../../../../test/utils/config';
import { ErrorReportingService } from '../../../../reporting/error-reporting.service';
import { TwilioProviderService } from './twilio.service';

const mockConfigValues = {
  TWILIO_PHONE_NUMBER: 'TWILIO_PHONE_NUMBER',
};

describe('TwilioProviderService', () => {
  let underTest: TwilioProviderService;
  let configService: ConfigService;
  let twilioService: TwilioService;
  let errorReporting: ErrorReportingService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TwilioProviderService)
      .mock(TwilioService)
      .using({
        client: {
          messages: {
            create: jest.fn(),
          },
        },
      })
      .mock(ConfigService)
      .using(createConfigMock(mockConfigValues))
      .mock(ErrorReportingService)
      .using({
        captureException: jest.fn(),
      })
      .compile();
    underTest = unit;
    configService = unitRef.get(ConfigService);
    twilioService = unitRef.get(TwilioService);
    errorReporting = unitRef.get(ErrorReportingService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(configService).toBeDefined();
    expect(twilioService).toBeDefined();
  });

  it('should send an SMS message', async () => {
    const mockPhone = faker.create.phone.number();
    const mockMessage = faker.create.lorem.sentence();

    await underTest.sendSms(mockPhone, mockMessage);

    expect(twilioService.client.messages.create).toHaveBeenCalledWith({
      body: mockMessage,
      from: mockConfigValues.TWILIO_PHONE_NUMBER,
      to: mockPhone,
    });
  });

  it('should capture exception when sending SMS fails', async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error('Twilio error'));

    twilioService.client.messages.create = mockCreate;

    const mockPhone = faker.create.phone.number();
    const mockMessage = faker.create.lorem.sentence();

    await underTest.sendSms(mockPhone, mockMessage);

    expect(mockCreate).toHaveBeenCalledWith({
      body: mockMessage,
      from: mockConfigValues.TWILIO_PHONE_NUMBER,
      to: mockPhone,
    });

    expect(errorReporting.captureException).toHaveBeenCalledWith(
      new Error('Twilio error'),
    );
  });
});
