import { Inject, Injectable } from '@nestjs/common';
import { SMS_MODULE_CONFIG } from '../sms.constants';
import { SMSProviderConfig, SmsProvider } from './base.interfaces';
import { DynamicSMSProviderService } from './dynamic-providers.service';

@Injectable()
export class SmsProviderService implements SmsProvider {
  provider: SmsProvider;

  constructor(
    @Inject(SMS_MODULE_CONFIG) private options: Record<string, any>,
    private readonly dynamicSmsProviderService: DynamicSMSProviderService,
  ) {
    this.initialize(options);
  }

  async getProvider(): Promise<SmsProvider> {
    return await this.dynamicSmsProviderService.getProvider(
      this.options.provider,
    );
  }

  initialize(config: any): void {
    this.getProvider().then((provider) => {
      provider.initialize(config);
      this.provider = provider;
    });
  }

  async sendSms(
    phone: string,
    message: string,
    config?: SMSProviderConfig,
  ): Promise<void> {
    return await this.provider.sendSms(phone, message, config);
  }
}
