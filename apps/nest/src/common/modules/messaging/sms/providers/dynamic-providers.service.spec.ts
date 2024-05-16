import { LazyModuleLoader } from '@nestjs/core';
import { TestBed } from 'testing';
import { SMSProviderName } from '../sms.constants';
import { DynamicSMSProviderService } from './dynamic-providers.service';
import { TwilioProviderModule } from './twilio/twilio.module';
import { TwilioProviderService } from './twilio/twilio.service';

describe('DynamicSMSProviderService', () => {
  let underTest: DynamicSMSProviderService;
  let mockLazyModuleLoader: LazyModuleLoader;
  let twilioModule: TwilioProviderModule;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DynamicSMSProviderService)
      .mock(LazyModuleLoader)
      .using({
        load: jest.fn((moduleFactory) => moduleFactory()),
      })
      .compile();

    underTest = unit;
    mockLazyModuleLoader = unitRef.get(LazyModuleLoader);

    const { unit: cognitoUnit } =
      TestBed.create(TwilioProviderModule).compile();

    twilioModule = cognitoUnit;
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(mockLazyModuleLoader).toBeDefined();
    expect(twilioModule).toBeDefined();
  });

  it('should load TwilioModule and get TwilioProviderService', async () => {
    const mockTwilioProviderServiceInstance = {} as TwilioProviderService;
    const mockModuleRef: any = {
      get: jest.fn().mockReturnValue(mockTwilioProviderServiceInstance),
    };

    underTest.loadModule = jest.fn().mockResolvedValue(mockModuleRef);

    const providerService = await underTest.getProvider(SMSProviderName.Twilio);

    expect(underTest.loadModule).toHaveBeenCalledWith('twilio');
    expect(mockModuleRef.get).toHaveBeenCalledWith(TwilioProviderService);
    expect(providerService).toBe(mockTwilioProviderServiceInstance);
  });
});
