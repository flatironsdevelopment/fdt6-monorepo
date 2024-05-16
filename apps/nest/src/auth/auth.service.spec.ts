import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from 'src/common/modules/user/user.service';
import { TestBed, faker } from 'testing';
import {
  EventOperation,
  UserCreatedWithOrganizationEvent,
} from '../common/constants/events';
import { AuthProviderService } from '../common/modules/auth/auth-provider.service';
import {
  QRCodeType,
  QRService,
  TextQRCodeType,
} from '../common/services/qr.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let underTest: AuthService;
  let provider: AuthProviderService;
  let qrService: QRService;
  let emitter: EventEmitter2;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService)
      .mock(AuthProviderService)
      .using({
        initialize: jest.fn(),
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        getUser: jest.fn().mockResolvedValue({
          id: faker.create.string.uuid(),
        }),
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
      })
      .mock(UserService)
      .using({
        create: jest.fn().mockResolvedValue({
          id: faker.create.string.uuid(),
        }),
      })
      .mock(EventEmitter2)
      .using({
        emit: jest.fn(),
      })
      .mock(QRService)
      .using({
        createQRCode: jest.fn(),
      })
      .compile();

    underTest = unit;
    provider = unitRef.get(AuthProviderService);
    qrService = unitRef.get(QRService);
    emitter = unitRef.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(emitter).toBeDefined();
  });

  describe('signIn', () => {
    it('should call provider signIn', async () => {
      expect(provider.signIn).not.toHaveBeenCalled();

      await underTest.signIn({
        email: faker.create.internet.email(),
        password: faker.create.internet.password(),
      });

      expect(provider.signIn).toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should call provider signUp', async () => {
      expect(provider.signUp).not.toHaveBeenCalled();

      await underTest.signUp({
        email: faker.create.internet.email(),
        password: faker.create.internet.password(),
        firstName: faker.create.person.firstName(),
        lastName: faker.create.person.lastName(),
      });

      expect(provider.signUp).toHaveBeenCalled();
    });

    it('should trigger create organization event', async () => {
      expect(provider.signUp).not.toHaveBeenCalled();

      const payload = {
        email: faker.create.internet.email(),
        password: faker.create.internet.password(),
        firstName: faker.create.person.firstName(),
        lastName: faker.create.person.lastName(),
        organizationName: faker.create.company.name(),
      };

      await underTest.signUp(payload);

      expect(emitter.emit).toHaveBeenCalledWith(
        EventOperation.USER_CREATED_WITH_ORGANIZATION,
        new UserCreatedWithOrganizationEvent({
          userId: expect.any(String),
          userEmail: payload.email,
          organizationName: payload.organizationName,
        }),
      );
    });
  });

  describe('confirmSignUp', () => {
    it('should call provider confirmSignUp', async () => {
      expect(provider.confirmSignUp).not.toHaveBeenCalled();

      await underTest.confirmSignUp({
        email: faker.create.internet.email(),
        code: faker.create.number.int().toString(),
      });

      expect(provider.confirmSignUp).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should call provider forgotPassword', async () => {
      expect(provider.forgotPassword).not.toHaveBeenCalled();

      await underTest.forgotPassword(faker.create.internet.email());

      expect(provider.forgotPassword).toHaveBeenCalled();
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('should call provider forgotPasswordSubmit', async () => {
      expect(provider.forgotPasswordSubmit).not.toHaveBeenCalled();

      await underTest.forgotPasswordSubmit(
        faker.create.internet.email(),
        faker.create.number.int().toString(),
        faker.create.internet.password(),
      );

      expect(provider.forgotPasswordSubmit).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should call provider changePassword', async () => {
      expect(provider.changePassword).not.toHaveBeenCalled();

      await underTest.changePassword(
        faker.create.internet.password(),
        faker.create.internet.password(),
        faker.create.string.uuid(),
      );

      expect(provider.changePassword).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should call provider signOut', async () => {
      expect(provider.signOut).not.toHaveBeenCalled();

      await underTest.signOut(faker.create.string.uuid());

      expect(provider.signOut).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should call provider refreshToken', async () => {
      expect(provider.refreshToken).not.toHaveBeenCalled();

      await underTest.refreshToken(faker.create.string.uuid());

      expect(provider.refreshToken).toHaveBeenCalled();
    });
  });

  describe('generateTOTPMfaSecret', () => {
    it('should call provider refreshToken', async () => {
      expect(provider.generateTOTPSecret).not.toHaveBeenCalled();
      expect(qrService.createQRCode).not.toHaveBeenCalled();
      await underTest.generateTOTPMfaSecret(
        faker.create.string.uuid(),
        faker.create.internet.email(),
        QRCodeType.IMAGE,
        TextQRCodeType.SVG,
      );
      expect(qrService.createQRCode).toHaveBeenCalled();
      expect(provider.generateTOTPSecret).toHaveBeenCalled();
    });
  });

  describe('verifyTOTPCode', () => {
    it('should call provider verifyTOTPCode', async () => {
      expect(provider.verifyCode).not.toHaveBeenCalled();

      await underTest.verifyTOTPCode(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
        faker.create.string.uuid(),
      );

      expect(provider.verifyCode).toHaveBeenCalled();
    });
  });

  describe('enableTOTPMfa', () => {
    it('should call provider enableTOTPMfa', async () => {
      expect(provider.enableTOTPMfa).not.toHaveBeenCalled();

      await underTest.enableTOTPMfa(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
        faker.create.string.uuid(),
      );

      expect(provider.enableTOTPMfa).toHaveBeenCalled();
    });
  });

  describe('disableTOTPMfa', () => {
    it('should call provider disableTOTPMfa', async () => {
      expect(provider.disableTOTPMfa).not.toHaveBeenCalled();

      await underTest.disableTOTPMfa(faker.create.string.uuid());

      expect(provider.disableTOTPMfa).toHaveBeenCalled();
    });
  });
  describe('resendEmail', () => {
    it('should call provider resendEmail', async () => {
      expect(provider.resendEmail).not.toHaveBeenCalled();

      await underTest.resendEmail(faker.create.internet.email());

      expect(provider.resendEmail).toHaveBeenCalled();
    });
  });
  describe('getSMSMfa', () => {
    it('should call provider getSMSMfa', async () => {
      expect(provider.getSMSMfa).not.toHaveBeenCalled();

      await underTest.getSMSMfa(faker.create.string.uuid());

      expect(provider.getSMSMfa).toHaveBeenCalled();
    });
  });
  describe('enableSMSMfa', () => {
    it('should call provider enableSMSMfa', async () => {
      expect(provider.enableSMSMfa).not.toHaveBeenCalled();

      await underTest.enableSMSMfa(
        faker.create.string.uuid(),
        faker.create.string.uuid(),
      );

      expect(provider.enableSMSMfa).toHaveBeenCalled();
    });
  });
  describe('disableSMSMfa', () => {
    it('should call provider disableSMSMfa', async () => {
      expect(provider.disableSMSMfa).not.toHaveBeenCalled();

      await underTest.disableSMSMfa(faker.create.string.uuid());

      expect(provider.disableSMSMfa).toHaveBeenCalled();
    });
  });
});
