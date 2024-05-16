import { TestBed, faker } from 'testing';
import { SMSProviderName, SMS_MODULE_CONFIG } from '../sms.constants';
import { DynamicSMSProviderService } from './dynamic-providers.service';
import { SmsProviderService } from './sms-provider.service';

describe('SmsProviderService', () => {
  let underTest: SmsProviderService;
  let dynamicProviderService: DynamicSMSProviderService;

  const createMockProvider = () => {
    const provider = {
      initialize: jest.fn(),
      sendSms: jest.fn(),
    };

    return provider;
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const { unit, unitRef } = TestBed.create(SmsProviderService)
      .mock(SMS_MODULE_CONFIG)
      .using({
        provider: SMSProviderName.Twilio,
      })
      .mock(DynamicSMSProviderService)
      .using({
        getProvider: jest.fn().mockResolvedValue(createMockProvider()),
      })
      .compile();

    underTest = unit;
    dynamicProviderService = unitRef.get(DynamicSMSProviderService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(dynamicProviderService).toBeDefined();
  });

  describe('initialize', () => {
    let mockProvider;

    beforeEach(() => {
      mockProvider = createMockProvider();

      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      underTest.initialize({});
    });
    it('should initialize provider', async () => {
      await underTest.initialize({});

      expect(dynamicProviderService.getProvider).toHaveBeenLastCalledWith(
        SMSProviderName.Twilio,
      );
      expect(mockProvider.initialize).toHaveBeenCalled();
    });
  });

  describe('sendSms', () => {
    let mockProvider;
    const phone = faker.create.phone.number();
    const message = faker.create.lorem.sentence();

    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call resendEmail', async () => {
      await underTest.sendSms(phone, message);

      expect(mockProvider.sendSms).toHaveBeenLastCalledWith(
        phone,
        message,
        undefined,
      );
    });
  });
});
