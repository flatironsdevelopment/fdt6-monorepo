import { faker } from 'testing';
import {
  AuthToken,
  DeliveryInfo,
  GenericResult,
} from './providers/base.interfaces';
import {
  CreateTotpUri,
  FormatToken,
  createAuthObject,
  createForgotPasswordDeliveryInfo,
  createGenericResult,
} from './utils';

describe('FormatToken', () => {
  it('should remove Bearer prefix from the token', () => {
    const token = 'Bearer yourTokenString';
    const formattedToken = FormatToken(token);

    expect(formattedToken).toBe('yourTokenString');
  });

  it('should handle tokens without Bearer prefix', () => {
    const token = 'yourTokenString';
    const formattedToken = FormatToken(token);

    expect(formattedToken).toBe('yourTokenString');
  });

  it('should handle empty token', () => {
    const token = '';
    const formattedToken = FormatToken(token);

    expect(formattedToken).toBe('');
  });
});

describe('CreateTotpUri', () => {
  it('should generate a valid TOTP URI', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const username = faker.create.internet.userName();
    const company = faker.create.company.name();
    const app = `${faker.create.word}fy`;

    const generatedUri = CreateTotpUri(secret, username, company, app);

    const expectedUri = `otpauth://totp/${app}:${username}?secret=${secret}&issuer=${company}`;

    expect(generatedUri).toBe(expectedUri);
  });
});

describe('createAuthObject', () => {
  it('should create an AuthToken object with provided values', () => {
    const mockAccessToken = faker.create.string.uuid();
    const mockRefreshToken = faker.create.string.uuid();
    const mockSession = faker.create.string.uuid();
    const mockUserId = faker.create.string.uuid();
    const mockChallengeName = faker.create.word.noun();

    const authObject = createAuthObject(
      mockAccessToken,
      mockRefreshToken,
      mockSession,
      mockUserId,
      mockChallengeName,
    );

    const expectedAuthObject: AuthToken = {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      session: mockSession,
      userId: mockUserId,
      challengeName: mockChallengeName,
    };

    expect(authObject).toEqual(expectedAuthObject);
  });

  it('should create an AuthToken object with undefined properties when no values are provided', () => {
    const authObject = createAuthObject();

    const expectedAuthObject: AuthToken = {
      accessToken: undefined,
      refreshToken: undefined,
      session: undefined,
      userId: undefined,
      challengeName: undefined,
    };

    expect(authObject).toEqual(expectedAuthObject);
  });
});

describe('createGenericResult', () => {
  it('should create a success GenericResult object with a message', () => {
    const mockSuccess = true;
    const mockMessage = faker.create.lorem.sentence();

    const result = createGenericResult(mockSuccess, mockMessage);

    const expectedGenericResult: GenericResult = {
      success: mockSuccess,
      message: mockMessage,
    };

    expect(result).toEqual(expectedGenericResult);
  });

  it('should create a failed GenericResult object without a message', () => {
    const mockSuccess = false;

    const result = createGenericResult(mockSuccess);

    const expectedGenericResult: GenericResult = {
      success: mockSuccess,
      message: undefined,
    };

    expect(result).toEqual(expectedGenericResult);
  });
});

describe('createForgotPasswordDeliveryInfo', () => {
  it('should create a DeliveryInfo object with provided values', () => {
    const mockMedium = 'email';
    const mockDestination = faker.create.internet.email();

    const deliveryInfo = createForgotPasswordDeliveryInfo(
      mockMedium,
      mockDestination,
    );

    const expectedDeliveryInfo: DeliveryInfo = {
      medium: mockMedium,
      destination: mockDestination,
    };

    expect(deliveryInfo).toEqual(expectedDeliveryInfo);
  });
});
