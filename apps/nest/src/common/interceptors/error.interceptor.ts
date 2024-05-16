import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorReportingService } from '../modules/reporting/error-reporting.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private errorService: ErrorReportingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        error: (exception) => {
          this.errorService.captureException(exception);
        },
      }),
    );
  }
}
