export enum SmsType {
  ACCOUNT_CREATED_CODE = 'account-created-code',
  RESEND_SMS_CODE = 'resend-sms-code',
  FORGOT_PASSWORD_CODE = 'forgot-password-code',
  UPDATE_PHONE_NUMBER_CODE = 'update-phone-number-code',
  VERIFY_PHONE_NUMBER_CODE = 'verify-phone-number-code',
  AUTHENTICATION_CODE = 'authentication-code',
}

export interface SmsDataType {
  [SmsType.ACCOUNT_CREATED_CODE]: {
    phone: string;
    code: string;
  };
  [SmsType.FORGOT_PASSWORD_CODE]: {
    phone: string;
    code: string;
  };
  [SmsType.UPDATE_PHONE_NUMBER_CODE]: {
    phone: string;
    code: string;
  };
  [SmsType.VERIFY_PHONE_NUMBER_CODE]: {
    phone: string;
    code: string;
  };
  [SmsType.RESEND_SMS_CODE]: {
    phone: string;
    code: string;
  };
  [SmsType.AUTHENTICATION_CODE]: {
    phone: string;
    code: string;
  };
}

export enum SMSProviderName {
  Twilio = 'twilio',
}

export const SMS_MODULE_CONFIG = 'SMS_MODULE_CONFIG';
