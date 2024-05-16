import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { ErrorReportingService } from '../../../../reporting/error-reporting.service';
import { SmsProvider } from '../base.interfaces';

@Injectable()
export class TwilioProviderService implements SmsProvider {
  public constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    private readonly errorReporting: ErrorReportingService,
  ) {}

  private get fromNumber(): string {
    return this.configService.get('TWILIO_PHONE_NUMBER');
  }

  public initialize(): void {}

  async sendSms(
    phone: string,
    message: string,
    config?: { from?: string },
  ): Promise<void> {
    const fromNumber = config?.from || this.fromNumber;

    try {
      await this.twilioService.client.messages.create({
        body: message,
        from: fromNumber,
        to: phone,
      });
    } catch (e) {
      this.errorReporting.captureException(e);
    }
  }
}
