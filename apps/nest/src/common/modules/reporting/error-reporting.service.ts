import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ErrorReportingService {
  private readonly logger = new Logger(ErrorReportingService.name);

  constructor(private readonly configService: ConfigService) {}

  init() {}

  captureException(error: any) {
    this.logger.error(error);
    if (this.configService.get('NODE_ENV') === 'production') {
      this.logger.error(`Report to Service ${error}`);
    }
  }
}
