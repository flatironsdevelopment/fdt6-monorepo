import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const PUBLIC_DECORATOR_NAME = 'isPublic';

export function Public() {
  return applyDecorators(
    SetMetadata(PUBLIC_DECORATOR_NAME, true),
    ApiTags('public endpoints'),
  );
}
