import { User } from 'src/common/database/entities/user.entity';
import { TestBed, factories, faker } from 'testing';
import { createMockResponseObject } from '../../test/utils/api';
import { CommonRequestHeader } from '../common/constants/request';
import { QRCodeType, TextQRCodeType } from '../common/services/qr.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let underTest: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController)
      .mock(AuthService)
      .using({
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        confirmSignUp: jest.fn(),
        forgotPassword: jest.fn(),
        forgotPasswordSubmit: jest.fn(),
        changePassword: jest.fn(),
        refreshToken: jest.fn(),
        generateTOTPMfaSecret: jest.fn(),
        verifyTOTPCode: jest.fn(),
        enableTOTPMfa: jest.fn(),
        disableTOTPMfa: jest.fn(),
        resendEmail: jest.fn(),
        getSMSMfa: jest.fn(),
        enableSMSMfa: jest.fn(),
        verifySMSCode: jest.fn(),
        disableSMSMfa: jest.fn(),
      })
      .compile();

    underTest = unit;
    service = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should call service signIn', async () => {
      expect(service.signIn).not.toHaveBeenCalled();

      await underTest.signIn({
        email: faker.create.internet.email(),
        password: faker.create.internet.password(),
      });

      expect(service.signIn).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should call service signUp', async () => {
      expect(service.signUp).not.toHaveBeenCalled();

      await underTest.signUp({
        email: faker.create.internet.email(),
        password: faker.create.internet.password(),
        firstName: faker.create.person.firstName(),
        lastName: faker.create.person.lastName(),
      });

      expect(service.signUp).toHaveBeenCalled();
    });
  });

  describe('confirmSignUp', () => {
    it('should call service confirmSignUp', async () => {
      expect(service.confirmSignUp).not.toHaveBeenCalled();

      await underTest.confirmSignUp({
        email: faker.create.internet.email(),
        code: faker.create.string.alphanumeric(),
      });

      expect(service.confirmSignUp).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should call service forgotPassword', async () => {
      expect(service.forgotPassword).not.toHaveBeenCalled();

      await underTest.forgotPassword({
        email: faker.create.internet.email(),
      });

      expect(service.forgotPassword).toHaveBeenCalled();
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('should call service forgotPasswordSubmit', async () => {
      expect(service.forgotPasswordSubmit).not.toHaveBeenCalled();

      await underTest.confirmForgotPassword({
        email: faker.create.internet.email(),
        code: faker.create.string.alphanumeric(),
        password: faker.create.internet.password(),
      });

      expect(service.forgotPasswordSubmit).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should call service changePassword', async () => {
      expect(service.changePassword).not.toHaveBeenCalled();

      await underTest.changePassword(
        { authorization: faker.create.string.alphanumeric() },
        {
          oldPassword: faker.create.internet.password(),
          newPassword: faker.create.internet.password(),
        },
      );

      expect(service.changePassword).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should call service signOut', async () => {
      expect(service.signOut).not.toHaveBeenCalled();

      await underTest.signOut({
        authorization: faker.create.string.alphanumeric(),
      });

      expect(service.signOut).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should call service refreshToken', async () => {
      expect(service.refreshToken).not.toHaveBeenCalled();

      await underTest.refreshToken({
        token: faker.create.string.alphanumeric(),
      });

      expect(service.refreshToken).toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('should call service getUser', async () => {
      const user = factories.UserFactory.build() as any;
      const response = await underTest.getSession(user);
      expect(response).toEqual({ user: User.mapToClient(user) });
    });
  });

  describe('getTotpMfaSecret', () => {
    it('should call service getTotpMfaSecret', async () => {
      expect(service.generateTOTPMfaSecret).not.toHaveBeenCalled();
      const res = createMockResponseObject();
      await underTest.getTotpMfaSecret(
        { authorization: faker.create.string.alphanumeric() },
        {
          email: faker.create.internet.email(),
        },
        {
          qrType: QRCodeType.IMAGE,
          qrFormat: TextQRCodeType.SVG,
        },
        res,
      );
      expect(service.generateTOTPMfaSecret).toHaveBeenCalled();
    });
  });

  describe('enableTotpMfa', () => {
    it('should call service enableTotpMfa', async () => {
      expect(service.enableTOTPMfa).not.toHaveBeenCalled();
      await underTest.enableTotpMfa(
        {
          [CommonRequestHeader.AUTHORIZATION]:
            faker.create.string.alphanumeric(),
          [CommonRequestHeader.USER_DEVICE]: faker.create.string.alphanumeric(),
        },
        {
          code: faker.create.string.alphanumeric(),
        },
      );
      expect(service.enableTOTPMfa).toHaveBeenCalled();
    });
  });

  describe('verifyTotpMfaCode', () => {
    it('should call service verifyTotpMfaCode', async () => {
      expect(service.verifyTOTPCode).not.toHaveBeenCalled();
      await underTest.verifyTotpMfaCode({
        code: faker.create.string.alphanumeric(),
        user: faker.create.string.alphanumeric(),
        session: faker.create.string.alphanumeric(),
      });
      expect(service.verifyTOTPCode).toHaveBeenCalled();
    });
  });

  describe('resendSignUp', () => {
    it('should call service resendSignUp', async () => {
      expect(service.resendEmail).not.toHaveBeenCalled();
      await underTest.resendSignUp({
        email: faker.create.internet.email(),
      });
      expect(service.resendEmail).toHaveBeenCalled();
    });
  });
  describe('getSmsMfa', () => {
    it('should call service getSmsMfa', async () => {
      expect(service.getSMSMfa).not.toHaveBeenCalled();
      await underTest.getSmsMfa({
        authorization: faker.create.string.alphanumeric(),
      });
      expect(service.getSMSMfa).toHaveBeenCalled();
    });
  });
  describe('enableSmsMfa', () => {
    it('should call service enableSmsMfa', async () => {
      expect(service.enableSMSMfa).not.toHaveBeenCalled();
      await underTest.enableSmsMfa(
        {
          authorization: faker.create.string.alphanumeric(),
        },
        {
          code: faker.create.internet.email(),
        },
      );
      expect(service.enableSMSMfa).toHaveBeenCalled();
    });
  });
  describe('verifySMSCode', () => {
    it('should call service verifySMSCode', async () => {
      expect(service.verifySMSCode).not.toHaveBeenCalled();
      await underTest.verifySMSCode({
        code: faker.create.string.uuid(),
        user: faker.create.string.uuid(),
        session: faker.create.string.uuid(),
      });
      expect(service.verifySMSCode).toHaveBeenCalled();
    });
  });
  describe('disableSMSMfa', () => {
    it('should call service disableSMSMfa', async () => {
      expect(service.disableSMSMfa).not.toHaveBeenCalled();
      await underTest.disableSMSMfa({
        authorization: faker.create.string.alphanumeric(),
      });
      expect(service.disableSMSMfa).toHaveBeenCalled();
    });
  });
});
