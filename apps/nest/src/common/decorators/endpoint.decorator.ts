import {
  HttpCode,
  HttpStatus,
  Type,
  UseGuards,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponse } from '../@types/pagination';
import { JWTAuthGuard } from '../guards/auth.guard';
import { PaginationInterceptor } from '../interceptors/pagination.interceptor';

export function SecuredEndpoint(httpCode: HttpStatus) {
  return applyDecorators(
    ApiBearerAuth(),
    HttpCode(httpCode),
    UseGuards(JWTAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function PaginatedEndpoint<TModel extends Type<any>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(PaginatedResponse),
    UseInterceptors(PaginationInterceptor),
    ApiTags('paginated endpoint'),
    ApiOkResponse({
      description: `return paginated ${model.name} list`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse<TModel>) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
