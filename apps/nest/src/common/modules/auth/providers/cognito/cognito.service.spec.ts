import {
  AssociateSoftwareTokenCommand,
  ChangePasswordCommand,
  GetUserAttributeVerificationCodeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  ResendConfirmationCodeCommand,
  SetUserMFAPreferenceCommand,
  VerifySoftwareTokenCommand,
  VerifyUserAttributeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { TestBed, faker } from 'testing';
import { createConfigMock } from '../../../../../../test/utils/config';
import { createGenericResult } from '../../utils';
import { CognitoProviderService } from './cognito.service';

const mockConfigValues = {
  AWS_COGNITO_USER_POOL_ID: 'mockUserPoolId',
  AWS_COGNITO_CLIENT_ID: 'mockClientId',
  AWS_REGION: 'mockRegion',
};

describe('CognitoProviderService', () => {
  let underTest: CognitoProviderService;
  let configService: ConfigService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CognitoProviderService)
      .mock(ConfigService)
      .using(createConfigMock(mockConfigValues))
      .compile();
    underTest = unit;
    configService = unitRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize Cognito services with provided configuration', () => {
      expect(configService.get).not.toHaveBeenCalled();

      underTest.initialize();

      expect(configService.get).toHaveBeenCalledTimes(3);

      expect((underTest as any).userPool).toBeDefined();
      expect((underTest as any).providerClient).toBeDefined();
      expect((underTest as any).serviceProvider).toBeDefined();
    });
  });
  describe('getCognitoUser', () => {
    it('should return a CognitoUser with provided email', () => {
      const mockEmail = faker.create.internet.email();
      const cognitoUser = underTest.getCognitoUser(mockEmail);
      expect(cognitoUser).toBeInstanceOf(CognitoUser);
      expect(cognitoUser.getUsername()).toBe(mockEmail);
    });
  });
  describe('signUp', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should sign up a user with provided email, password, and additional data', async () => {
      const mockEmail = faker.create.internet.email();
      const mockPassword = faker.create.internet.password();
      const mockAdditionalData = {
        age: 25,
        firstName: faker.create.person.firstName(),
        lastName: faker.create.person.lastName(),
      };

      const spy = jest.spyOn((underTest as any).userPool, 'signUp');

      const signUpResult = await underTest.signUp(
        mockEmail,
        mockPassword,
        mockAdditionalData,
      );

      expect(spy).toHaveBeenCalledWith(
        mockEmail,
        mockPassword,
        [
          new CognitoUserAttribute({ Name: 'email', Value: mockEmail }),
          new CognitoUserAttribute({
            Name: 'age',
            Value: `${mockAdditionalData.age}`,
          }),
          new CognitoUserAttribute({
            Name: 'firstName',
            Value: `${mockAdditionalData.firstName}`,
          }),
          new CognitoUserAttribute({
            Name: 'lastName',
            Value: `${mockAdditionalData.lastName}`,
          }),
        ],
        null,
        expect.any(Function),
      );

      expect(signUpResult).toMatchSnapshot();
    });
  });

  describe('signIn', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should sign in a user with valid credentials', async () => {
      const validUsername = faker.create.internet.email();
      const validPassword = faker.create.internet.password();
      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');
      const user = new CognitoUser({
        Username: validUsername,
        Pool: (underTest as any).userPool,
      });

      getUserSpy.mockImplementation(() => {
        return user;
      });

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'initiateAuth',
      );

      expect(getUserSpy).not.toHaveBeenCalled();
      expect(mockServiceProvider).not.toHaveBeenCalled();

      const signInResult = await underTest.signIn(validUsername, validPassword);

      expect(mockServiceProvider).toHaveBeenCalled();
      expect(mockServiceProvider).toHaveBeenCalledWith(
        {
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
          AuthParameters: {
            USERNAME: validUsername,
            PASSWORD: validPassword,
          },
        },
        expect.any(Function),
      );
      expect(signInResult).toMatchSnapshot();
    });

    it('should handle sign in failure for invalid credentials', async () => {
      const validUsername = faker.create.internet.email();
      const wrongPassword = 'wrong-password';

      await expect(
        underTest.signIn(validUsername, wrongPassword),
      ).rejects.toEqual(expect.any(Error));
    });
  });

  describe('confirmSignUp', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should confirm sign up with valid verification code', async () => {
      const validUsername = faker.create.internet.email();
      const validVerificationCode = `${faker.create.number.int({
        min: 100000,
        max: 999999,
      })}`;

      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');
      const user = new CognitoUser({
        Username: validUsername,
        Pool: (underTest as any).userPool,
      });

      getUserSpy.mockImplementation(() => {
        return user;
      });

      const confirmRegistrationSpy = jest.spyOn(user, 'confirmRegistration');

      expect(getUserSpy).not.toHaveBeenCalled();
      expect(confirmRegistrationSpy).not.toHaveBeenCalled();

      const confirmSignUpResult = await underTest.confirmSignUp(
        validUsername,
        validVerificationCode,
      );

      expect(getUserSpy).toHaveBeenCalledWith(validUsername);
      expect(confirmRegistrationSpy).toHaveBeenCalledWith(
        validVerificationCode,
        true,
        expect.any(Function),
      );

      expect(confirmSignUpResult).toMatchSnapshot();
    });

    it('should handle confirmation failure for invalid verification code', async () => {
      const validUsername = faker.create.internet.email();
      const invalidVerificationCode = 'wrong-code';

      await expect(
        underTest.confirmSignUp(validUsername, invalidVerificationCode),
      ).rejects.toEqual(expect.any(Error));
    });
  });

  describe('forgotPassword', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should initiate forgot password flow for user', async () => {
      const validUsername = faker.create.internet.email();
      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');
      const user = new CognitoUser({
        Username: validUsername,
        Pool: (underTest as any).userPool,
      });

      getUserSpy.mockImplementation(() => {
        return user;
      });

      const forgotPasswordSpy = jest.spyOn(user, 'forgotPassword');

      expect(getUserSpy).not.toHaveBeenCalled();
      expect(forgotPasswordSpy).not.toHaveBeenCalled();

      const forgotPasswordResult =
        await underTest.forgotPassword(validUsername);

      expect(getUserSpy).toHaveBeenCalledWith(validUsername);
      expect(forgotPasswordSpy).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onFailure: expect.any(Function),
      });

      expect(forgotPasswordResult).toMatchSnapshot();
    });
  });

  describe('forgotPasswordSubmit', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should confirm forgot password with valid verification code and new password', async () => {
      const validUsername = faker.create.internet.email();
      const validVerificationCode = `${faker.create.number.int({
        min: 100000,
        max: 999999,
      })}`;
      const validNewPassword = faker.create.internet.password();

      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');
      const user = new CognitoUser({
        Username: validUsername,
        Pool: (underTest as any).userPool,
      });

      getUserSpy.mockImplementation(() => {
        return user;
      });

      const forgotPasswordSpy = jest.spyOn(user, 'confirmPassword');

      expect(getUserSpy).not.toHaveBeenCalled();
      expect(forgotPasswordSpy).not.toHaveBeenCalled();

      const forgotPasswordSubmitResult = await underTest.forgotPasswordSubmit(
        validUsername,
        validVerificationCode,
        validNewPassword,
      );

      expect(getUserSpy).toHaveBeenCalledWith(validUsername);
      expect(forgotPasswordSpy).toHaveBeenCalledWith(
        validVerificationCode,
        validNewPassword,
        {
          onSuccess: expect.any(Function),
          onFailure: expect.any(Function),
        },
      );

      expect(forgotPasswordSubmitResult).toMatchSnapshot();
    });

    it('should handle confirmation failure for invalid verification code or new password', async () => {
      const validUsername = faker.create.internet.email();
      const validVerificationCode = 'wrong-code';
      const validNewPassword = faker.create.internet.password();

      await expect(
        underTest.forgotPasswordSubmit(
          validUsername,
          validVerificationCode,
          validNewPassword,
        ),
      ).rejects.toEqual(expect.any(Error));
    });
  });

  describe('signOut', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should sign out with a valid access token', async () => {
      const validAccessToken = 'validToken';

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      const signOutResult = await underTest.signOut(validAccessToken);

      expect(mockProviderClient).toHaveBeenCalledWith(
        new GlobalSignOutCommand({
          AccessToken: validAccessToken,
        }),
      );

      expect(signOutResult).toMatchSnapshot();
    });
  });

  describe('getUserByToken', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should get user data by access token', async () => {
      const validAccessToken = faker.create.string.uuid();
      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      const getUserResult = await underTest.getUserByToken(validAccessToken);

      expect(mockProviderClient).toHaveBeenCalledWith(
        new GetUserCommand({
          AccessToken: validAccessToken,
        }),
      );

      expect(getUserResult).toBe(getUserResult);
    });
  });

  describe('getUser', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should get user data by email', async () => {
      const validEmail = faker.create.internet.email();
      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');

      const getUserResult = await underTest.getUser(validEmail);

      expect(getUserSpy).toHaveBeenCalledWith(validEmail);
      expect(getUserResult).toMatchSnapshot();
    });

    it('should handle error if getUserData fails', async () => {
      const invalidEmail = faker.create.internet.email();
      const getUserSpy = jest.spyOn(underTest, 'getCognitoUser');
      const user = new CognitoUser({
        Username: invalidEmail,
        Pool: (underTest as any).userPool,
      });

      getUserSpy.mockImplementation(() => {
        return user;
      });

      const signInSpy = jest.spyOn(user, 'getUserData');

      signInSpy.mockImplementation((callback) => {
        callback(new Error('Not found'), null);
      });

      await expect(underTest.getUser(invalidEmail)).rejects.toEqual(
        expect.any(Error),
      );

      expect(underTest.getCognitoUser).toHaveBeenCalledWith(invalidEmail);
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
    it('should change password with valid access token and old/new passwords', async () => {
      const validAccessToken = faker.create.string.uuid();
      const validOldPassword = faker.create.internet.password();
      const validNewPassword = faker.create.internet.password();
      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      const changePasswordResult = await underTest.changePassword(
        validAccessToken,
        validOldPassword,
        validNewPassword,
      );

      expect(mockProviderClient).toHaveBeenCalledWith(
        new ChangePasswordCommand({
          AccessToken: validAccessToken,
          PreviousPassword: validOldPassword,
          ProposedPassword: validNewPassword,
        }),
      );

      expect(changePasswordResult).toMatchSnapshot();
    });
  });

  describe('refreshToken', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should refresh token with valid refresh token', async () => {
      const validRefreshToken = faker.create.string.uuid();

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'initiateAuth',
      );

      const refreshTokenResult =
        await underTest.refreshToken(validRefreshToken);

      expect(mockServiceProvider).toHaveBeenCalledWith(
        {
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: expect.any(String),
          AuthParameters: {
            REFRESH_TOKEN: validRefreshToken,
          },
        },
        expect.any(Function),
      );

      expect(refreshTokenResult).toMatchSnapshot();
    });

    it('should handle error for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid-refresh-token';

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'initiateAuth',
      );

      await expect(underTest.refreshToken(invalidRefreshToken)).rejects.toEqual(
        expect.any(Error),
      );

      expect(mockServiceProvider).toHaveBeenCalledWith(
        {
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: expect.any(String),
          AuthParameters: {
            REFRESH_TOKEN: invalidRefreshToken,
          },
        },
        expect.any(Function),
      );
    });
  });

  describe('generateTOTPSecret', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
    it('should generate TOTP Secret', async () => {
      const validAccessToken = faker.create.string.uuid();
      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      const generateTOTPSecretResult =
        await underTest.generateTOTPSecret(validAccessToken);

      expect(mockProviderClient).toHaveBeenCalledWith(
        new AssociateSoftwareTokenCommand({
          AccessToken: validAccessToken,
        }),
      );

      expect(generateTOTPSecretResult).toMatchSnapshot();
    });
  });

  describe('verifyTOTPCode', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should verify valid TOTP code', async () => {
      const code = faker.create.number
        .int({ min: 100000, max: 999999 })
        .toString();
      const user = faker.create.string.uuid();
      const session = faker.create.string.uuid();

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'respondToAuthChallenge',
      );

      const verifyTOTPSecretResult = await underTest.verifyCode(
        user,
        session,
        code,
      );

      expect(mockServiceProvider).toHaveBeenCalledWith({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ClientId: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
        ChallengeResponses: {
          USERNAME: user,
          SOFTWARE_TOKEN_MFA_CODE: code,
        },
        Session: session,
      });

      expect(verifyTOTPSecretResult).toMatchSnapshot();
    });

    it('should verify invalid TOTP code and return error', async () => {
      const code = 'wrong-code';
      const user = faker.create.string.uuid();
      const session = faker.create.string.uuid();

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'respondToAuthChallenge',
      );

      await expect(underTest.verifyCode(user, session, code)).rejects.toEqual(
        expect.any(Error),
      );

      expect(mockServiceProvider).toHaveBeenCalledWith({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ClientId: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
        ChallengeResponses: {
          USERNAME: user,
          SOFTWARE_TOKEN_MFA_CODE: code,
        },
        Session: session,
      });
    });

    it('should verify invalid session and return error', async () => {
      const code = faker.create.number
        .int({ min: 100000, max: 999999 })
        .toString();
      const user = faker.create.string.uuid();
      const session = 'wrong-session';

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'respondToAuthChallenge',
      );

      await expect(underTest.verifyCode(user, session, code)).rejects.toEqual(
        expect.any(Error),
      );

      expect(mockServiceProvider).toHaveBeenCalledWith({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ClientId: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
        ChallengeResponses: {
          USERNAME: user,
          SOFTWARE_TOKEN_MFA_CODE: code,
        },
        Session: session,
      });
    });

    it('should verify invalid user and return error', async () => {
      const code = faker.create.number
        .int({ min: 100000, max: 999999 })
        .toString();
      const user = 'wrong-username';
      const session = faker.create.string.uuid();

      const mockServiceProvider = jest.spyOn(
        (underTest as any).serviceProvider,
        'respondToAuthChallenge',
      );

      await expect(underTest.verifyCode(user, session, code)).rejects.toEqual(
        expect.any(Error),
      );

      expect(mockServiceProvider).toHaveBeenCalledWith({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ClientId: configService.get<string>('AWS_COGNITO_CLIENT_ID'),
        ChallengeResponses: {
          USERNAME: user,
          SOFTWARE_TOKEN_MFA_CODE: code,
        },
        Session: session,
      });
    });
  });

  describe('enableTOTPMfa', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should enable TOTP MFA', async () => {
      const token = faker.create.string.uuid();
      const device = faker.create.string.uuid();
      const code = faker.create.number
        .int({ min: 100000, max: 999999 })
        .toString();

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      expect(mockProviderClient).not.toHaveBeenCalled();

      const enableTOTPMfaResult = await underTest.enableTOTPMfa(
        token,
        device,
        code,
      );

      expect(mockProviderClient).toHaveBeenCalledWith(
        new VerifySoftwareTokenCommand({
          AccessToken: token,
          FriendlyDeviceName: device,
          UserCode: code,
        }),
      );

      expect(mockProviderClient).toHaveBeenCalledTimes(2);

      expect(enableTOTPMfaResult).toMatchSnapshot();
    });

    it('should not enable TOTP MFA with wrong token', async () => {
      const token = 'wrong-token';
      const device = faker.create.string.uuid();
      const code = faker.create.number
        .int({ min: 100000, max: 999999 })
        .toString();

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      mockProviderClient.mockResolvedValueOnce({
        Status: 'ERROR',
      });

      expect(mockProviderClient).not.toHaveBeenCalled();
      await underTest.enableTOTPMfa(token, device, code);

      expect(mockProviderClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('disableTOTPMfa', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should disable TOTP MFA', async () => {
      const token = faker.create.string.uuid();

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      expect(mockProviderClient).not.toHaveBeenCalled();

      const disableTOTPMfaResult = await underTest.disableTOTPMfa(token);

      expect(mockProviderClient).toHaveBeenCalledWith(
        new SetUserMFAPreferenceCommand({
          AccessToken: token,
          SoftwareTokenMfaSettings: {
            Enabled: false,
            PreferredMfa: false,
          },
        }),
      );

      expect(mockProviderClient).toHaveBeenCalledTimes(1);

      expect(disableTOTPMfaResult).toMatchSnapshot();
    });
  });
  describe('resendEmail', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should resend email confirmation code and return DeliveryInfo', async () => {
      const email = faker.create.internet.email();
      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );

      const result = await underTest.resendEmail(email);
      expect(result).toMatchSnapshot();
      expect(mockProviderClient).toHaveBeenCalledWith(
        new ResendConfirmationCodeCommand({
          Username: email,
          ClientId: mockConfigValues.AWS_COGNITO_CLIENT_ID,
        }),
      );
    });
  });
  describe('verifyUserAttribute', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should verify user attribute and return response', async () => {
      const mockToken = faker.create.string.uuid();
      const mockAttributeName = 'email';
      const mockCode = faker.create.string.uuid();

      const mockResponse = {};

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );
      const result = await underTest.verifyUserAttribute(
        mockToken,
        mockAttributeName,
        mockCode,
      );

      expect(result).toEqual(mockResponse);

      expect(mockProviderClient).toHaveBeenCalledWith(
        new VerifyUserAttributeCommand({
          AccessToken: mockToken,
          AttributeName: mockAttributeName,
          Code: mockCode,
        }),
      );
    });
  });
  describe('getSMSMfa', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should get SMS MFA details and return DeliveryInfo', async () => {
      const mockToken = faker.create.string.uuid();

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );
      const result = await underTest.getSMSMfa(mockToken);

      expect(result).toMatchSnapshot();

      expect(mockProviderClient).toHaveBeenCalledWith(
        new GetUserAttributeVerificationCodeCommand({
          AccessToken: mockToken,
          AttributeName: 'phone_number',
        }),
      );
    });
  });

  describe('enableSMSMfa', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should enable SMS MFA and return success result', async () => {
      const mockToken = faker.create.string.uuid();
      const mockCode = faker.create.string.uuid();

      jest
        .spyOn(underTest, 'verifyUserAttribute')
        .mockResolvedValueOnce(undefined);

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );
      const result = await underTest.enableSMSMfa(mockToken, mockCode);

      expect(result).toEqual(createGenericResult(true));

      expect(mockProviderClient).toHaveBeenCalledWith(
        new SetUserMFAPreferenceCommand({
          AccessToken: mockToken,
          SMSMfaSettings: {
            Enabled: true,
            PreferredMfa: true,
          },
        }),
      );
    });

    it('should return failure result when an error occurs', async () => {
      const mockToken = faker.create.string.uuid();
      const mockCode = faker.create.string.uuid();
      const mockErrorMessage = 'Failed to verify attribute';

      jest
        .spyOn(underTest, 'verifyUserAttribute')
        .mockRejectedValueOnce(new Error(mockErrorMessage));

      const result = await underTest.enableSMSMfa(mockToken, mockCode);

      expect(result).toEqual(createGenericResult(false, mockErrorMessage));
    });
  });
  describe('disableSMSMfa', () => {
    beforeEach(() => {
      underTest.initialize();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should disable SMS MFA and return success result', async () => {
      const mockToken = faker.create.string.uuid();

      const mockProviderClient = jest.spyOn(
        (underTest as any).providerClient,
        'send',
      );
      const result = await underTest.disableSMSMfa(mockToken);

      expect(result).toEqual(createGenericResult(true));

      expect(mockProviderClient).toHaveBeenCalledWith(
        new SetUserMFAPreferenceCommand({
          AccessToken: mockToken,
          SMSMfaSettings: {
            Enabled: false,
            PreferredMfa: false,
          },
        }),
      );
    });
  });
});
