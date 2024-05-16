import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min } from 'class-validator';
import {
  PaginatedResponse as IPaginatedResponse,
  PaginationBase as IPaginationBase,
  PaginationOptions as IPaginationOptions,
} from '~types';

class PaginationBase implements IPaginationBase {
  @ApiProperty({
    name: 'current',
    required: true,
    type: Number,
    description: 'Current page number',
  })
  current: number;

  @ApiProperty({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    name: 'totalCount',
    required: true,
    type: Number,
    description: 'Total number of items',
  })
  totalCount: number;

  @ApiProperty({
    name: 'totalPages',
    required: true,
    type: Number,
    description: 'Total number of pages',
  })
  totalPages: number;
}

export interface PaginationMetaData<T> extends PaginationBase {
  data: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationData extends PaginationBase {
  @ApiProperty({
    name: 'next',
    required: false,
    type: String,
    description: 'Next page URL',
  })
  next?: string | null;

  @ApiProperty({
    name: 'previous',
    required: false,
    type: String,
    description: 'Previous page URL',
  })
  previous?: string | null;
}

export class PaginatedResponse<T> implements IPaginatedResponse<T> {
  @ApiProperty({
    name: 'data',
    required: true,
    isArray: true,
    description: 'Data returned from the query',
  })
  data: T[];

  @ApiProperty({
    name: 'pagination',
    required: true,
    type: PaginationData,
    description: 'Pagination metadata',
  })
  pagination: PaginationData;
}

export class PaginationOptions implements IPaginationOptions {
  @ApiProperty({
    name: 'current',
    required: true,
    type: Number,
    description: 'Current page number',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  current: number;

  @ApiProperty({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  limit: number;
}
