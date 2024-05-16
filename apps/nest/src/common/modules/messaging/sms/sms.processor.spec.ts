import { Job } from 'bull';
import { TestBed, faker } from 'testing';
import { ErrorReportingService } from '../../reporting/error-reporting.service';
import { SmsProviderService } from './providers/sms-provider.service';
import { ISendSmsOptions, SmsProcessor } from './sms.processor';

describe('SmsProcessor', () => {
  let underTest: SmsProcessor;
  let smsProvider: SmsProviderService;
  let reportingService: ErrorReportingService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(SmsProcessor)
      .mock(SmsProviderService)
      .using({
        getProvider: jest.fn(),
        sendSms: jest.fn(),
      })
      .mock(ErrorReportingService)
      .using({
        captureException: jest.fn(),
      })
      .compile();

    underTest = unit;
    smsProvider = unitRef.get(SmsProviderService);
    reportingService = unitRef.get(ErrorReportingService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(smsProvider).toBeDefined();
    expect(reportingService).toBeDefined();
  });

  it('should send an SMS message and log success', () => {
    const mockJobData: Job<ISendSmsOptions> = {
      data: {
        to: faker.create.phone.number(),
        message: faker.create.lorem.sentence(),
        config: { from: faker.create.phone.number() },
      },
    } as any;

    underTest.handleSendSms(mockJobData);

    expect(smsProvider.sendSms).toHaveBeenCalledWith(
      mockJobData.data.to,
      mockJobData.data.message,
      mockJobData.data.config,
    );
  });

  it('should capture exception when sending SMS fails', () => {
    (smsProvider.sendSms as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to send SMS');
    });

    const mockJobData: Job<ISendSmsOptions> = {
      data: {
        to: faker.create.phone.number(),
        message: faker.create.lorem.sentence(),
        config: { from: faker.create.phone.number() },
      },
    } as any;

    underTest.handleSendSms(mockJobData);

    expect(reportingService.captureException).toHaveBeenCalledWith(
      new Error('Failed to send SMS'),
    );
  });
});
