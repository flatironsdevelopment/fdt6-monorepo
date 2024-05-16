import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { createExecutionContext } from '../../../test/utils/request';
import { Organization } from '../database/entities/organization.entity';
import { PaginationInterceptor } from './pagination.interceptor';

describe('PaginationInterceptor', () => {
  it('should be defined', () => {
    expect(new PaginationInterceptor()).toBeDefined();
  });

  let interceptor: PaginationInterceptor<Organization>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationInterceptor],
    }).compile();

    interceptor = module.get<PaginationInterceptor<Organization>>(
      PaginationInterceptor,
    );
  });

  it('should transform the response into a PaginatedResponse with default options', async () => {
    const path = '/some/path';
    const contextMock = createExecutionContext({ url: path });
    const nextMock = {
      handle: () =>
        of({
          data: [],
          totalCount: 100,
          current: 1,
          limit: 10,
          totalPages: 10,
          hasNextPage: true,
          hasPreviousPage: false,
        }),
    } as CallHandler;

    const result = await firstValueFrom(
      interceptor.intercept(contextMock, nextMock),
    );

    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      current: 1,
      limit: 10,
      totalCount: 100,
      totalPages: 10,
      next: `${path}?page=2`,
      previous: null,
    });
  });

  it('should transform the response into a PaginatedResponse with custom options', async () => {
    const path = '/some/path';
    const contextMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          url: path,
        }),
      }),
    } as ExecutionContext;
    const nextMock = {
      handle: () =>
        of({
          data: [],
          totalCount: 100,
          current: 2,
          limit: 20,
          totalPages: 5,
          hasNextPage: true,
          hasPreviousPage: true,
        }),
    } as CallHandler;

    const result = await firstValueFrom(
      interceptor.intercept(contextMock, nextMock),
    );

    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      current: 2,
      limit: 20,
      totalCount: 100,
      totalPages: 5,
      next: `${path}?page=3`,
      previous: `${path}?page=1`,
    });
  });
});
