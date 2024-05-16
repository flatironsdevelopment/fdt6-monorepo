import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from 'src/common/modules/user/user.service';
import {
  EventOperation,
  UserCreatedWithOrganizationEvent,
} from '../common/constants/events';
import { AuthProviderService } from '../common/modules/auth/auth-provider.service';
import { CreateTotpUri, FormatToken } from '../common/modules/auth/utils';
import {
  QRCodeType,
  QRService,
  TextQRCodeType,
} from '../common/services/qr.service';
import { SignInDto } from './dto/sign-in.dto';
import { ConfirmSignUpDto, SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly provider: AuthProviderService,
    private readonly configService: ConfigService,
    private readonly qrService: QRService,
    private readonly eventEmitter2: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  async signIn(body: SignInDto) {
    const { email, password } = body;
    const session = await this.provider.signIn(email, password);
    return session;
  }

  async signUp(body: SignUpDto) {
    const { email, password, organizationName, ...attributes } = body;

    const signUpResponse = await this.provider.signUp(email, password, {
      family_name: attributes.lastName,
      given_name: attributes.firstName,
      phone_number: attributes.phoneNumber,
    });

    const userEntity = await this.provider.getUser(email);

    const user = await this.userService.create({
      email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      phoneNumber: attributes.phoneNumber,
      provider: this.provider.provider.name,
      providerId: userEntity.id,
    });

    if (organizationName) {
      this.eventEmitter2.emit(
        EventOperation.USER_CREATED_WITH_ORGANIZATION,
        new UserCreatedWithOrganizationEvent({
          userId: user.id,
          userEmail: email,
          organizationName,
        }),
      );
    }

    return signUpResponse;
  }

  async confirmSignUp(body: ConfirmSignUpDto) {
    const { email, code } = body;
    const result = await this.provider.confirmSignUp(email, code);
    return result;
  }

  async forgotPassword(email: string) {
    const result = await this.provider.forgotPassword(email);
    return result;
  }

  async forgotPasswordSubmit(email: string, code: string, newPassword: string) {
    const result = await this.provider.forgotPasswordSubmit(
      email,
      code,
      newPassword,
    );
    return result;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    token: string,
  ) {
    const result = await this.provider.changePassword(
      FormatToken(token),
      oldPassword,
      newPassword,
    );
    return result;
  }

  async signOut(token: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.signOut(formattedToken);
  }

  async refreshToken(token: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.refreshToken(formattedToken);
  }

  async generateTOTPMfaSecret(
    token: string,
    email: string,
    qrType: QRCodeType,
    qrFormat: TextQRCodeType,
  ) {
    const formattedToken = FormatToken(token);
    const secret = await this.provider.generateTOTPSecret(formattedToken);

    const appName = this.configService.get<string>('APP_NAME');
    const issuer = this.configService.get<string>('APP_COMPANY');

    const totpUri = CreateTotpUri(secret, email, issuer, appName);
    return this.qrService.createQRCode(totpUri, qrType, qrFormat);
  }

  async verifyTOTPCode(user: string, session: string, code: string) {
    return await this.provider.verifyCode(
      user,
      session,
      code,
      ChallengeNameType.SOFTWARE_TOKEN_MFA,
    );
  }

  async verifySMSCode(user: string, session: string, code: string) {
    return await this.provider.verifyCode(
      user,
      session,
      code,
      ChallengeNameType.SMS_MFA,
    );
  }

  async resendEmail(email: string) {
    return await this.provider.resendEmail(email);
  }

  async enableTOTPMfa(token: string, device: string, code: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.enableTOTPMfa(formattedToken, device, code);
  }

  async disableTOTPMfa(token: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.disableTOTPMfa(formattedToken);
  }

  async getSMSMfa(token: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.getSMSMfa(formattedToken);
  }

  async enableSMSMfa(token: string, code: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.enableSMSMfa(formattedToken, code);
  }

  async disableSMSMfa(token: string) {
    const formattedToken = FormatToken(token);
    return await this.provider.disableSMSMfa(formattedToken);
  }
}
