import { addPaginationToQuery, getPaginatedResult } from './pagination';

describe('addPaginationToQuery', () => {
  const builderMock = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
  } as any;
  it('should correctly apply pagination with default options', () => {
    const options = {
      current: 1,
      limit: 10,
    };

    const result = addPaginationToQuery(builderMock, options);

    expect(result.skip).toHaveBeenCalledWith(0);
    expect(result.take).toHaveBeenCalledWith(10);
  });

  it('should correctly apply pagination with custom options', () => {
    const options = { current: 2, limit: 20 };

    const result = addPaginationToQuery(builderMock, options);

    expect(result.skip).toHaveBeenCalledWith(20);
    expect(result.take).toHaveBeenCalledWith(20);
  });
});

describe('getPaginatedResult', () => {
  const mockData = [];
  const mockTotalCount = 100;
  it('should return the paginated result with default options', async () => {
    const queryMock = {
      getManyAndCount: jest.fn().mockResolvedValue([mockData, mockTotalCount]),
    } as any;
    const options = {
      current: 1,
      limit: 10,
    };

    const result = await getPaginatedResult(queryMock, options);

    expect(result.data).toEqual(mockData);
    expect(result.totalCount).toBe(mockTotalCount);
    expect(result.current).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(10);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should return the paginated result with custom options', async () => {
    const queryMock = {
      getManyAndCount: jest.fn().mockResolvedValue([mockData, mockTotalCount]),
    } as any;
    const options = { current: 2, limit: 20 };

    const result = await getPaginatedResult(queryMock, options);

    expect(result.data).toEqual(mockData);
    expect(result.totalCount).toBe(mockTotalCount);
    expect(result.current).toBe(2);
    expect(result.limit).toBe(20);
    expect(result.totalPages).toBe(5);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
  });
});
