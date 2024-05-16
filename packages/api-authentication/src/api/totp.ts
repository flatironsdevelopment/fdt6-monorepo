import { GenericResponse, QRCode, SessionTokens } from '../types'
import { ApiClient } from './client'
import { BASE_API_URL } from './constants'
import { handleRefetchResponse } from './utils'

const ROUTE = 'auth/totp'

export enum TOTPQRCodeType {
  IMAGE = 'image',
  DATA_URL = 'data-url',
  TEXT = 'text'
}
export enum TOTPQRCodeFormat {
  SVG = 'svg',
  UTF8 = 'utf8',
  TERMINAL = 'terminal'
}

export const GetTOTPQRCodeEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
  qrType: TOTPQRCodeType
  qrFormat?: TOTPQRCodeFormat
}): Promise<QRCode> => {
  const { accessToken, qrType, qrFormat, client } = payload

  let query = `qrType=${qrType}`

  if (qrFormat) {
    query = query.concat(`&qrFormat=${qrFormat}`)
  }

  return client(`${BASE_API_URL}/v1/${ROUTE}?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(async ({ response }: any) => {
    if (response.ok) {
      if (qrType === 'image') {
        return response.blob()
      }

      return response.text()
    }
    const er = await response.json()
    throw new Error(er)
  })
}

export const VerifyTOTPEndpoint = async (payload: {
  client: ApiClient
  code: string
  user: string
  session: string
}): Promise<SessionTokens> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rest)
  }).then(handleRefetchResponse)
}

export const EnableTOTPMfaEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
  code: string
}): Promise<GenericResponse> => {
  const { accessToken, client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'user-device': 'web'
    },
    body: JSON.stringify(rest)
  }).then(handleRefetchResponse)
}

export const DisableTOTPMfaEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
}): Promise<GenericResponse> => {
  const { accessToken, client } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(handleRefetchResponse)
}
