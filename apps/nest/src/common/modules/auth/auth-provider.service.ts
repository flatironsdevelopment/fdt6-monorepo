import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserData } from 'src/common/models/user.model';
import { AUTH_MODULE_CONFIG, AuthProviderName } from './constants';
import {
  AdditionalData,
  AuthProvider,
  AuthToken,
  DeliveryInfo,
  GenericResult,
} from './providers/base.interfaces';
import { DynamicAuthProviderService } from './providers/dynamic-providers.service';

@Injectable()
export class AuthProviderService implements AuthProvider {
  provider: AuthProvider;

  get name(): AuthProviderName {
    return this.provider.name;
  }

  constructor(
    @Inject(AUTH_MODULE_CONFIG) private options: Record<string, any>,
    private readonly dynamicAuthProviderService: DynamicAuthProviderService,
  ) {
    this.initialize(options);
  }

  async getProvider(): Promise<AuthProvider> {
    return await this.dynamicAuthProviderService.getProvider(
      this.options.provider,
    );
  }

  initialize(config: any): void {
    this.getProvider().then((provider) => {
      provider.initialize(config);
      this.provider = provider;
    });
  }

  async signUp(
    username: string,
    password: string,
    additionalData?: AdditionalData,
  ): Promise<GenericResult> {
    try {
      return await this.provider.signUp(username, password, additionalData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signIn(username: string, password: string): Promise<AuthToken> {
    try {
      return await this.provider.signIn(username, password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signOut(token: string): Promise<GenericResult> {
    try {
      return await this.provider.signOut(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUser(email: string): Promise<UserData> {
    try {
      return await this.provider.getUser(email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async confirmSignUp(username: string, code: string): Promise<GenericResult> {
    try {
      return await this.provider.confirmSignUp(username, code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPassword(username: string): Promise<DeliveryInfo> {
    try {
      return await this.provider.forgotPassword(username);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPasswordSubmit(
    username: string,
    code: string,
    newPassword: string,
  ): Promise<GenericResult> {
    try {
      return await this.provider.forgotPasswordSubmit(
        username,
        code,
        newPassword,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changePassword(
    user: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<GenericResult> {
    try {
      return await this.provider.changePassword(user, oldPassword, newPassword);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByToken(token: string): Promise<UserData> {
    try {
      return await this.provider.getUserByToken(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(token: string): Promise<AuthToken> {
    try {
      return await this.provider.refreshToken(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateSMSMfaCode(token: string): Promise<DeliveryInfo> {
    try {
      return await this.provider.resendEmail(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateTOTPSecret(token: string): Promise<string> {
    try {
      return await this.provider.generateTOTPSecret(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resendEmail(email: string): Promise<DeliveryInfo> {
    try {
      return await this.provider.resendEmail(email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyCode(
    user: string,
    session: string,
    code: string,
    type: ChallengeNameType,
  ): Promise<AuthToken> {
    try {
      return await this.provider.verifyCode(user, session, code, type);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async enableTOTPMfa(
    token: string,
    device: string,
    code: string,
  ): Promise<GenericResult> {
    try {
      return await this.provider.enableTOTPMfa(token, device, code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async disableTOTPMfa(token: string): Promise<GenericResult> {
    try {
      return await this.provider.disableTOTPMfa(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSMSMfa(token: string): Promise<DeliveryInfo> {
    try {
      return await this.provider.getSMSMfa(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async enableSMSMfa(token: string, code: string): Promise<GenericResult> {
    try {
      return await this.provider.enableSMSMfa(token, code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async disableSMSMfa(token: string): Promise<GenericResult> {
    try {
      return await this.provider.disableSMSMfa(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async healthCheck(): Promise<GenericResult> {
    return await this.provider.healthCheck();
  }
}
