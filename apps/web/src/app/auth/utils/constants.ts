export const Links = {
  DASHBOARD: '/dashboard',
  HOME: '/',
  LOGIN: '/auth/login',
  LOGIN_2FA: '/auth/login/two-factor',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/registration',
  CHANGE_PASSWORD: '/auth/change-password',
  CHANGE_PASSWORD_SUCCESS: '/auth/change-password/success',
  FORGOT_PASSWORD: '/auth/recovery',
  FORGOT_PASSWORD_CONFIRMATION: '/auth/recovery/verification',
  CONFIRM_ACCOUNT: '/auth/verification',
  SETTINGS: '/settings',
  TWO_FACTOR: '/auth/two-factor',
  TWO_FACTOR_SMS: '/auth/two-factor/sms',
  TWO_FACTOR_APP: '/auth/two-factor/app',
  CONFIRM_TWO_FACTOR_SMS: '/auth/two-factor/sms/confirm',
  SUCCESS_TWO_FACTOR_SMS: '/auth/two-factor/sms/success',
  SUCCESS_TWO_FACTOR_APP: '/auth/two-factor/app/success'
} as const

export const APILinks = {
  CLEAR_SESSION: '/auth/api/clear-session',
  LOGOUT: '/auth/api/logout'
} as const
