import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import { GenericResult } from '../modules/auth/providers/base.interfaces';
import { CommonRequestHeader } from './request';

export class GenericResultResponse implements GenericResult {
  @ApiProperty({
    description: 'Success of the operation.',
    example: true,
    type: Boolean,
    required: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message of the operation.',
    example: 'Success',
    type: String,
    required: false,
  })
  message?: string;
}

export function ApiKeyHeaderDoc() {
  return applyDecorators(
    ApiHeader({
      name: CommonRequestHeader.API_KEY_HEADER,
      description: 'Api key secret',
    }),
  );
}
