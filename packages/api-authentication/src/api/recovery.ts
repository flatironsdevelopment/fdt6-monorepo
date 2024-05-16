import { DeliveryInfoResponse, GenericResponse } from '../types'
import { ApiClient } from './client'
import { BASE_API_URL } from './constants'
import { handleRefetchResponse, handleResponse } from './utils'

const ROUTE = 'auth'

export const ForgotPasswordEndpoint = async (payload: {
  client: typeof fetch
  email: string
}): Promise<DeliveryInfoResponse> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const ForgotPasswordSubmitEndpoint = async (payload: {
  client: typeof fetch
  email: string
  code: string
  newPassword: string
}): Promise<GenericResponse> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/forgot-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: rest.email,
      code: rest.code,
      new_password: rest.newPassword
    })
  }).then(handleResponse)
}

export const ResendSignUpEndpoint = async (payload: {
  client: typeof fetch
  email: string
}): Promise<DeliveryInfoResponse> => {
  const { client, ...rest } = payload
  return client(`${BASE_API_URL}/v1/${ROUTE}/email/resend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  }).then(handleResponse)
}

export const ChangePasswordEndpoint = async (payload: {
  client: ApiClient
  accessToken: string
  oldPassword: string
  newPassword: string
}): Promise<GenericResponse> => {
  const { client, ...body } = payload
  const { accessToken, ...rest } = body
  return client(`${BASE_API_URL}/v1/${ROUTE}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      old_password: rest.oldPassword,
      new_password: rest.newPassword
    })
  }).then(handleRefetchResponse)
}
