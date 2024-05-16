import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { UserData } from '../../../models/user.model';
import { AuthProviderName } from '../constants';

export enum Auth2FAMethod {
  SMS = 'sms',
  TOTP = 'totp',
}

export interface AuthToken {
  accessToken?: string;
  refreshToken?: string;
  session?: string;
  userId?: string;
  challengeName?: string;
}

export interface GenericResult {
  success: boolean;
  message?: string;
}

export interface DeliveryInfo {
  medium: string;
  destination: string;
}

export interface AdditionalData {
  [key: string]: string | number;
}

export interface AuthProvider {
  get name(): AuthProviderName;
  initialize(config?: any): void;
  signUp(
    username: string,
    password: string,
    additionalData?: AdditionalData,
  ): Promise<GenericResult>;
  signIn(username: string, password: string): Promise<AuthToken>;
  signOut(token: string): Promise<GenericResult>;
  getUser(username: string): Promise<UserData>;
  getUserByToken(token: string): Promise<UserData>;
  confirmSignUp(username: string, code: string): Promise<GenericResult>;
  forgotPassword(username: string): Promise<DeliveryInfo>;
  forgotPasswordSubmit(
    username: string,
    code: string,
    newPassword: string,
  ): Promise<GenericResult>;
  changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<GenericResult>;
  refreshToken(token: string): Promise<AuthToken>;
  resendEmail(email: string): Promise<DeliveryInfo>;
  generateTOTPSecret(token: string): Promise<string>;
  verifyCode(
    user: string,
    session: string,
    code: string,
    type: ChallengeNameType,
  ): Promise<AuthToken>;
  enableTOTPMfa(
    token: string,
    device: string,
    code: string,
  ): Promise<GenericResult>;
  disableTOTPMfa(token: string): Promise<GenericResult>;
  getSMSMfa(token: string): Promise<DeliveryInfo>;
  enableSMSMfa(token: string, code: string): Promise<GenericResult>;
  disableSMSMfa(token: string): Promise<GenericResult>;
  healthCheck(): Promise<GenericResult>;
}
