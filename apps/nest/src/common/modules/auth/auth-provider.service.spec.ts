import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { TestBed, faker } from 'testing';
import { AuthProviderService } from './auth-provider.service';
import { AUTH_MODULE_CONFIG, AuthProviderName } from './constants';
import { DynamicAuthProviderService } from './providers/dynamic-providers.service';

describe('AuthProviderService', () => {
  let underTest: AuthProviderService;
  let dynamicProviderService: DynamicAuthProviderService;

  const createMockProvider = () => {
    const provider = {
      initialize: jest.fn(),
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      confirmSignUp: jest.fn(),
      forgotPassword: jest.fn(),
      forgotPasswordSubmit: jest.fn(),
      changePassword: jest.fn(),
      getUserByToken: jest.fn(),
      refreshToken: jest.fn(),
      generateTOTPSecret: jest.fn(),
      verifyCode: jest.fn(),
      enableTOTPMfa: jest.fn(),
      disableTOTPMfa: jest.fn(),
      resendEmail: jest.fn(),
      getSMSMfa: jest.fn(),
      enableSMSMfa: jest.fn(),
      disableSMSMfa: jest.fn(),
    };

    return provider;
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const { unit, unitRef } = TestBed.create(AuthProviderService)
      .mock(AUTH_MODULE_CONFIG)
      .using({
        provider: AuthProviderName.COGNITO,
      })
      .mock(DynamicAuthProviderService)
      .using({
        getProvider: jest.fn().mockResolvedValue(createMockProvider()),
      })
      .compile();

    underTest = unit;
    dynamicProviderService = unitRef.get(DynamicAuthProviderService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(dynamicProviderService).toBeDefined();
  });

  describe('initialize', () => {
    let mockProvider;

    beforeEach(() => {
      mockProvider = createMockProvider();

      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      underTest.initialize({});
    });
    it('should initialize provider', async () => {
      await underTest.initialize({});

      expect(dynamicProviderService.getProvider).toHaveBeenLastCalledWith(
        AuthProviderName.COGNITO,
      );
      expect(mockProvider.initialize).toHaveBeenCalled();
    });
  });

  describe('getProvider', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should get provider', async () => {
      const provider = await underTest.getProvider();

      expect(dynamicProviderService.getProvider).toHaveBeenLastCalledWith(
        AuthProviderName.COGNITO,
      );
      expect(provider).toBe(mockProvider);
    });
  });

  describe('signUp', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call signUp', async () => {
      const email = faker.create.internet.email();
      const password = faker.create.internet.password();
      const additionalData = {
        firstName: 'John',
        lastName: 'Doe',
      };
      await underTest.signUp(email, password, additionalData);

      expect(mockProvider.signUp).toHaveBeenLastCalledWith(
        email,
        password,
        additionalData,
      );
    });

    it('should throw error if signUp fails', async () => {
      const email = faker.create.internet.email();
      const password = faker.create.internet.password();
      mockProvider.signUp.mockRejectedValue(new Error('signUp failed'));

      await expect(underTest.signUp(email, password)).rejects.toThrow(
        expect.any(Error),
      );
    });
  });

  describe('signIn', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call signIn', async () => {
      const email = faker.create.internet.email();
      const password = faker.create.internet.password();

      await underTest.signIn(email, password);

      expect(mockProvider.signIn).toHaveBeenLastCalledWith(email, password);
    });

    it('should throw error if signIn fails', async () => {
      const email = faker.create.internet.email();
      const password = faker.create.internet.password();
      mockProvider.signIn.mockRejectedValue(new Error('signIn failed'));

      await expect(underTest.signIn(email, password)).rejects.toThrow(
        expect.any(Error),
      );
    });
  });

  describe('signOut', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call signOut', async () => {
      const token = faker.create.internet.password();

      await underTest.signOut(token);

      expect(mockProvider.signOut).toHaveBeenLastCalledWith(token);
    });
  });

  describe('getUser', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call getUser', async () => {
      const token = faker.create.internet.password();

      await underTest.getUser(token);

      expect(mockProvider.getUser).toHaveBeenLastCalledWith(token);
    });
  });

  describe('confirmSignUp', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call confirmSignUp', async () => {
      const email = faker.create.internet.email();
      const code = faker.create.internet.password();

      await underTest.confirmSignUp(email, code);

      expect(mockProvider.confirmSignUp).toHaveBeenLastCalledWith(email, code);
    });
  });

  describe('forgotPassword', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call forgotPassword', async () => {
      const email = faker.create.internet.email();

      await underTest.forgotPassword(email);

      expect(mockProvider.forgotPassword).toHaveBeenLastCalledWith(email);
    });
  });

  describe('forgotPasswordSubmit', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call forgotPasswordSubmit', async () => {
      const email = faker.create.internet.email();
      const code = faker.create.internet.password();
      const newPassword = faker.create.internet.password();

      await underTest.forgotPasswordSubmit(email, code, newPassword);

      expect(mockProvider.forgotPasswordSubmit).toHaveBeenLastCalledWith(
        email,
        code,
        newPassword,
      );
    });
  });

  describe('changePassword', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call changePassword', async () => {
      const oldPassword = faker.create.internet.password();
      const newPassword = faker.create.internet.password();
      const token = faker.create.internet.password();

      await underTest.changePassword(token, oldPassword, newPassword);

      expect(mockProvider.changePassword).toHaveBeenLastCalledWith(
        token,
        oldPassword,
        newPassword,
      );
    });
  });

  describe('getUserByToken', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call getUserByToken', async () => {
      const token = faker.create.internet.password();

      await underTest.getUserByToken(token);

      expect(mockProvider.getUserByToken).toHaveBeenLastCalledWith(token);
    });
  });

  describe('refreshToken', () => {
    let mockProvider;
    beforeEach(() => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );
      underTest.initialize({});
    });

    it('should call refreshToken', async () => {
      const token = faker.create.internet.password();

      await underTest.refreshToken(token);

      expect(mockProvider.refreshToken).toHaveBeenLastCalledWith(token);
    });
  });

  describe('generateTOTPSecret', () => {
    let mockProvider;
    const token = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call generateTOTPSecret', async () => {
      await underTest.generateTOTPSecret(token);

      expect(mockProvider.generateTOTPSecret).toHaveBeenLastCalledWith(token);
    });
  });

  describe('verifyTOTPCode', () => {
    let mockProvider;
    const user = faker.create.string.uuid();
    const session = faker.create.string.uuid();
    const code = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call verifyCode', async () => {
      await underTest.verifyCode(
        user,
        session,
        code,
        ChallengeNameType.SOFTWARE_TOKEN_MFA,
      );

      expect(mockProvider.verifyCode).toHaveBeenLastCalledWith(
        user,
        session,
        code,
        ChallengeNameType.SOFTWARE_TOKEN_MFA,
      );
    });
  });

  describe('enableTOTPMfa', () => {
    let mockProvider;
    const device = faker.create.string.uuid();
    const token = faker.create.string.uuid();
    const code = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call enableTOTPMfa', async () => {
      await underTest.enableTOTPMfa(token, device, code);

      expect(mockProvider.enableTOTPMfa).toHaveBeenLastCalledWith(
        token,
        device,
        code,
      );
    });
  });

  describe('disableTOTPMfa', () => {
    let mockProvider;
    const token = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call disableTOTPMfa', async () => {
      await underTest.disableTOTPMfa(token);

      expect(mockProvider.disableTOTPMfa).toHaveBeenLastCalledWith(token);
    });
  });
  describe('resendEmail', () => {
    let mockProvider;
    const email = faker.create.internet.email();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call resendEmail', async () => {
      await underTest.resendEmail(email);

      expect(mockProvider.resendEmail).toHaveBeenLastCalledWith(email);
    });
  });
  describe('getSMSMfa', () => {
    let mockProvider;
    const token = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call getSMSMfa', async () => {
      await underTest.getSMSMfa(token);

      expect(mockProvider.getSMSMfa).toHaveBeenLastCalledWith(token);
    });
  });
  describe('enableSMSMfa', () => {
    let mockProvider;
    const token = faker.create.string.uuid();
    const code = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call enableSMSMfa', async () => {
      await underTest.enableSMSMfa(token, code);

      expect(mockProvider.enableSMSMfa).toHaveBeenLastCalledWith(token, code);
    });
  });
  describe('disableSMSMfa', () => {
    let mockProvider;
    const token = faker.create.string.uuid();
    beforeEach(async () => {
      mockProvider = createMockProvider();
      (dynamicProviderService.getProvider as jest.Mock).mockResolvedValue(
        mockProvider,
      );

      await underTest.initialize({});
    });

    it('should call disableSMSMfa', async () => {
      await underTest.disableSMSMfa(token);

      expect(mockProvider.disableSMSMfa).toHaveBeenLastCalledWith(token);
    });
  });
});
