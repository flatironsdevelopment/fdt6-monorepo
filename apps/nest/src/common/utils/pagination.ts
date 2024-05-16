import { SelectQueryBuilder } from 'typeorm';
import { PaginationMetaData, PaginationOptions } from '../@types/pagination';

export const addPaginationToQuery = <T>(
  builder: SelectQueryBuilder<T>,
  options: PaginationOptions,
): SelectQueryBuilder<T> => {
  const { current = 1, limit = 10 } = options;
  return builder.skip((current - 1) * limit).take(limit);
};

export const getPaginatedResult = async <T>(
  query: SelectQueryBuilder<T>,
  options: PaginationOptions,
  mapper?: (data: T[]) => any[],
): Promise<PaginationMetaData<T>> => {
  const { current = 1, limit = 10 } = options;
  const [data, total] = await query.getManyAndCount();

  return {
    data: mapper ? mapper(data) : data,
    totalCount: total,
    current: current,
    limit: limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: current < Math.ceil(total / limit),
    hasPreviousPage: current > 1,
  };
};
