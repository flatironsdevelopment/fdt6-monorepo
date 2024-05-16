export const createConfigMock = (configs: any = {}) => {
  const defaults = {
    AWS_COGNITO_USER_POOL_ID: 'us-east-2_5DEYLvvFJ',
    AWS_COGNITO_CLIENT_ID: '61lhnbrnaj4j0930pevjov22k1',
    AWS_REGION: 'us-east-2',
    APP_NAME: 'APP_NAME',
    APP_COMPANY: 'APP_COMPANY',
    PORT: 3000,
    REDIS_URL: 'REDIS_URL',
    SMTP_URL: 'SMTP_URL',
    SMTP_FROM: 'SMTP_FROM',
    PREVIEW_EMAILS: 'PREVIEW_EMAILS',
    HOST_URL: 'HOST_URL',
    API_KEY_HEADER: 'API_KEY_HEADER',
    TWILIO_ACCOUNT_SID: 'TWILIO_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: 'TWILIO_AUTH_TOKEN',
    TWILIO_VERIFY_SID: 'TWILIO_VERIFY_SID',
    TWILIO_PHONE_NUMBER: 'TWILIO_PHONE_NUMBER',
    ...configs,
  };

  return {
    values: defaults,
    get: jest.fn().mockImplementation((key: string) => {
      return defaults[key];
    }),
  };
};
