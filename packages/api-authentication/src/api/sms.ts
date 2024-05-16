import { DeliveryInfoResponse, GenericResponse, SessionTokens } from '../types'
import { ApiClient } from './client'
import { BASE_API_URL } from './constants'
import { handleRefetchResponse } from './utils'

const ROUTE = 'auth/SMS'

export const GetSMSCodeEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
}): Promise<DeliveryInfoResponse> => {
  const { accessToken, client } = payload

  return client(`${BASE_API_URL}/v1/${ROUTE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(handleRefetchResponse)
}

export const VerifySMSEndpoint = async (payload: {
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

export const EnableSMSMfaEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
  code: string
}): Promise<GenericResponse> => {
  const { accessToken, client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(rest)
  }).then(handleRefetchResponse)
}

export const DisableSMSMfaEndpoint = async (payload: {
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
