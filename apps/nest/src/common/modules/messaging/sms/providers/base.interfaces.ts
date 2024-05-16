export interface SMSProviderConfig {
  from?: string;
}

export interface SmsProvider {
  initialize(config: any): void;
  sendSms(
    phone: string,
    message: string,
    config?: SMSProviderConfig,
  ): Promise<void>;
}
