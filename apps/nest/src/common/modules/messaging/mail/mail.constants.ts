export enum MailTemplates {
  ACCOUNT_CREATED = 'account-created',
  RESEND_CODE = 'resend-code',
  FORGOT_PASSWORD = 'forgot-password',
  UPDATE_EMAIL = 'update-email',
  VERIFY_EMAIL = 'verify-email',
  AUTHENTICATION = 'authentication',
  ORGANIZATION_INVITATION = 'organization-invitation',
}

export interface MailDataType {
  [MailTemplates.ACCOUNT_CREATED]: {
    email: string;
    code: string;
  };
  [MailTemplates.RESEND_CODE]: {
    email: string;
    code: string;
  };
  [MailTemplates.FORGOT_PASSWORD]: {
    email: string;
    code: string;
  };
  [MailTemplates.UPDATE_EMAIL]: {
    email: string;
    code: string;
  };
  [MailTemplates.VERIFY_EMAIL]: {
    email: string;
    code: string;
  };
  [MailTemplates.AUTHENTICATION]: {
    email: string;
    code: string;
  };
  [MailTemplates.ORGANIZATION_INVITATION]: {
    email: string;
    organizationName: string;
    link: string;
  };
}

export const EmailTemplateSubject = {
  [MailTemplates.ACCOUNT_CREATED]: 'Account created',
  [MailTemplates.AUTHENTICATION]: 'Authentication code',
  [MailTemplates.FORGOT_PASSWORD]: 'Forget Password',
  [MailTemplates.RESEND_CODE]: 'Verification Code',
  [MailTemplates.UPDATE_EMAIL]: 'Update Email',
  [MailTemplates.VERIFY_EMAIL]: 'Verify Email',
  [MailTemplates.ORGANIZATION_INVITATION]:
    "You're invited to join an organization!",
};
