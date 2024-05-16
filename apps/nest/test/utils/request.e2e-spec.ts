import { createExecutionContext } from './request'; // Import the function to be tested

describe('createExecutionContext', () => {
  it('should create an ExecutionContext with request, response, and next', () => {
    const mockRequest = {};
    const mockResponse = {};
    const mockNext = jest.fn();

    const executionContext = createExecutionContext(
      mockRequest,
      mockResponse,
      mockNext,
    );

    expect(executionContext).toBeDefined();
    expect(typeof executionContext).toBe('object');

    expect(typeof executionContext.switchToHttp).toBe('function');

    const httpContext = executionContext.switchToHttp();
    expect(httpContext.getRequest()).toBeTruthy();
    expect(httpContext.getResponse()).toBeTruthy();
    expect(httpContext.getNext()).toBeTruthy();
  });

  it('should create an ExecutionContext without request, response, and next', () => {
    const executionContext = createExecutionContext();

    expect(executionContext).toBeDefined();
    expect(typeof executionContext).toBe('object');

    expect(typeof executionContext.switchToHttp).toBe('function');

    const httpContext = executionContext.switchToHttp();
    expect(httpContext.getRequest()).not.toBeUndefined();
    expect(httpContext.getResponse()).not.toBeUndefined();
    expect(httpContext.getNext()).toBeTruthy();
  });
});
