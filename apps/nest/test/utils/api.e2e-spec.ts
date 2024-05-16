import { AppModule } from '../../src/app.module';
import { createApiMock, createMockResponseObject } from './api';

describe('createApiMock', () => {
  it('should create a mock NestJS application with necessary configurations', async () => {
    const mockApp = await createApiMock();
    const importedAppModule = mockApp.get(AppModule);
    expect(importedAppModule).toBeInstanceOf(AppModule);
  });
});

describe('createMockResponseObject', () => {
  it('should create a mock response object', () => {
    const responseValue = { message: 'Test message' };
    const mockResponse = createMockResponseObject(responseValue);

    expect(mockResponse).toHaveProperty('status');
    expect(mockResponse).toHaveProperty('json');
    expect(mockResponse).toHaveProperty('writeHead');
    expect(mockResponse).toHaveProperty('end');

    expect(typeof mockResponse.status).toBe('function');
    expect(typeof mockResponse.json).toBe('function');
    expect(typeof mockResponse.writeHead).toBe('function');
    expect(typeof mockResponse.end).toBe('function');

    expect(mockResponse.status()).toBe(200);
    expect(mockResponse.json()).toEqual(responseValue);
  });

  it('should create a mock response object without a specified response', () => {
    const mockResponse = createMockResponseObject();

    expect(mockResponse.status()).toBe(200);
    expect(mockResponse.json()).toBeUndefined();
  });
});
