import { Module } from '@nestjs/common';
import { ErrorReportingService } from './error-reporting.service';

@Module({
  providers: [ErrorReportingService],
  exports: [ErrorReportingService],
})
export class ReportingModule {}
