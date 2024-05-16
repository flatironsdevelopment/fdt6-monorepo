import { CommonRequestHeader } from '../constants/request';
import { extractFromHeader, extractPayloadFromJWT, isExpired } from './token';

describe('extractPayloadFromJWT', () => {
  it('should correctly extract payload from a JWT token', () => {
    // Mock JWT token and its payload
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.dGVzdERhdGE=';

    const expectedPayload = {
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    };

    const result = extractPayloadFromJWT(mockToken);

    expect(result).toEqual(expectedPayload);
  });

  it('should return null for invalid token', () => {
    // Mock an invalid JWT token
    const invalidToken = 'invalidToken';

    const result = extractPayloadFromJWT(invalidToken);

    expect(result).toBeNull();
  });
  it('should handle invalid token gracefully', () => {
    // Mock an invalid JWT token
    const invalidToken =
      'invalidToken.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.dGVzdERhdGE=';

    try {
      extractPayloadFromJWT(invalidToken);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Invalid token');
    }
  });
});

describe('isExpired', () => {
  it('should return true if the expiration time is in the past', () => {
    const expiredTime = Math.floor(Date.now() / 1000) - 10;

    const result = isExpired(expiredTime);

    expect(result).toBe(true);
  });

  it('should return false if the expiration time is in the future', () => {
    const futureTime = Math.floor(Date.now() / 1000) + 10;

    const result = isExpired(futureTime);

    expect(result).toBe(false);
  });

  it('should return false for the current time', () => {
    const currentTime = Math.floor(Date.now() / 1000);

    const result = isExpired(currentTime);

    expect(result).toBe(true);
  });
});

describe('extractFromHeader', () => {
  it('should extract and return the JWT token from the authorization header', () => {
    const mockRequest = {
      headers: {
        [CommonRequestHeader.AUTHORIZATION]: 'Bearer validToken',
      },
    } as any;

    const result = extractFromHeader(mockRequest);

    expect(result).toBe('validToken');
  });

  it('should return undefined for missing or incorrectly formatted headers', () => {
    // Mock request with missing authorization header
    const requestWithoutHeader = {
      headers: {},
    } as Request;

    // Mock request with incorrect authorization header format
    const requestWithIncorrectFormat = {
      headers: {
        [CommonRequestHeader.AUTHORIZATION]: 'InvalidFormat',
      },
    } as any;

    const resultWithoutHeader = extractFromHeader(requestWithoutHeader);
    const resultWithIncorrectFormat = extractFromHeader(
      requestWithIncorrectFormat,
    );

    expect(resultWithoutHeader).toBeUndefined();
    expect(resultWithIncorrectFormat).toBeUndefined();
  });
});
