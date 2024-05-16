import { User } from '~types'
import { GenericResponse, SignInStateType } from '../types'
import { ApiClient } from './client'
import { BASE_API_URL } from './constants'
import { handleRefetchResponse, handleResponse } from './utils'

const ROUTE = 'auth'

export const SignInEndpoint = async (payload: {
  client: typeof fetch
  email: string
  password: string
}): Promise<SignInStateType> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const SignUpEndpoint = async (payload: {
  client: typeof fetch
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}): Promise<GenericResponse> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const SignOutEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
}): Promise<GenericResponse> => {
  const { client, accessToken, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/sign-out`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(rest)
  }).then(handleRefetchResponse)
}

export const RefreshTokenEndpoint = async (payload: {
  client: typeof fetch
  token: string
}): Promise<{ accessToken: string }> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const ConfirmSignUpEndpoint = async (payload: {
  client: typeof fetch
  email: string
  code: string
}): Promise<GenericResponse> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/sign-up/confirm`, {
    method: 'Put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const GetSessionEndpoint = async (payload: {
  client: ApiClient | typeof fetch
  accessToken: string
}): Promise<User> => {
  const { client, accessToken } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/session`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(handleRefetchResponse)
}
