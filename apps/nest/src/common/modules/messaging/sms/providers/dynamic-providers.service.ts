import { Injectable } from '@nestjs/common';
import { LazyModuleLoader, ModuleRef } from '@nestjs/core';

import { SMSProviderName } from '../sms.constants';
import { SmsProvider } from './base.interfaces';
import { TwilioProviderModule } from './twilio/twilio.module';
import { TwilioProviderService } from './twilio/twilio.service';

type SMSProviderType = typeof TwilioProviderService;

const providers: Record<SMSProviderName, SMSProviderType> = {
  [SMSProviderName.Twilio]: TwilioProviderService,
};

@Injectable()
export class DynamicSMSProviderService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async loadModule(provider: SMSProviderName): Promise<ModuleRef> {
    let moduleRef: ModuleRef;
    if (provider === SMSProviderName.Twilio) {
      moduleRef = await this.lazyModuleLoader.load(() => TwilioProviderModule);
    }

    if (!moduleRef) {
      throw new Error('No valid SMS provider found');
    }

    return moduleRef;
  }

  async getProvider(provider: SMSProviderName): Promise<SmsProvider> {
    const moduleRef = await this.loadModule(provider);
    return moduleRef.get(providers[provider]);
  }
}
