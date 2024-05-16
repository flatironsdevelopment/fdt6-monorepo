import { ConfigService } from '@nestjs/config';
import { ErrorReportingService } from '../modules/reporting/error-reporting.service';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  it('should be defined', () => {
    expect(
      new ErrorInterceptor(new ErrorReportingService(new ConfigService())),
    ).toBeDefined();
  });
});
