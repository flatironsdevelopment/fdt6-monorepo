import {
  AuthToken,
  DeliveryInfo,
  GenericResult,
} from './providers/base.interfaces';

export const FormatToken = (token: string) => {
  return token.replace('Bearer ', '');
};

export const CreateTotpUri = (
  secret: string,
  username: string,
  company: string,
  app: string,
) => {
  const authCode = `otpauth://totp/${app}:${username}?secret=${secret}&issuer=${company}`;

  return authCode;
};

export const createAuthObject = (
  accessToken?: string,
  refreshToken?: string,
  session?: string,
  userId?: string,
  challengeName?: string,
): AuthToken => {
  return {
    accessToken,
    refreshToken,
    session,
    userId,
    challengeName,
  };
};

export const createGenericResult = (
  success: boolean,
  message?: string,
): GenericResult => {
  return {
    success,
    message,
  };
};

export const createForgotPasswordDeliveryInfo = (
  medium: string,
  destination: string,
): DeliveryInfo => {
  return {
    medium,
    destination,
  };
};
