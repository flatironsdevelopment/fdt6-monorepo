interface SessionBase {}

export interface SessionTokens {
  accessToken: string
  refreshToken: string
}

export interface Session extends SessionBase {
  accessToken: string
  refreshToken: string
  session: never
  userId: never
  challengeName: never
}

export interface ChallengeData extends SessionBase {
  accessToken: never
  refreshToken: never
  session: string
  userId: string
  challengeName: string
}

export interface FeatureState<T> {
  isLoading: boolean
  isError: boolean
  error?: Error
  data?: T
}

export interface GenericResponse {
  success: boolean
  message?: string | undefined
}

export interface DeliveryInfoResponse {
  medium: string
  destination: string
}

export type SignInStateType = Session | ChallengeData

export type QRCode = String | Blob

export { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider'
