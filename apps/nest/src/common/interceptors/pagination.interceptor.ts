import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse, PaginationMetaData } from '../@types/pagination';

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    return next.handle().pipe(
      map((response: PaginationMetaData<T>) => {
        const path = context.switchToHttp().getRequest().url.split('?')[0];
        return {
          data: response.data as any[],
          pagination: {
            current: +response.current,
            limit: +response.limit,
            totalCount: response.totalCount,
            totalPages: response.totalPages,
            next: response.hasNextPage
              ? `${path}?page=${+response.current + 1}`
              : null,
            previous: response.hasPreviousPage
              ? `${path}?page=${+response.current - 1}`
              : null,
          },
        };
      }),
    );
  }
}
