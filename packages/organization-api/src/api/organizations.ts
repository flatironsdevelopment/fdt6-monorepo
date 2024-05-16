import { api } from 'api-authentication'
import { Organization, PaginatedResponse, PaginationOptions } from '~types'

const ROUTE = 'organizations'

export const GetOrganizationsEndpoint = async (
  payload: {
    client: api.client.ApiClient
    accessToken: string
  } & PaginationOptions
): Promise<PaginatedResponse<Organization>> => {
  const { client, ...body } = payload
  const { accessToken, current, limit } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}?current=${current}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}

export const GetOrganizationDetailsEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
}): Promise<Organization> => {
  const { client, ...body } = payload
  const { accessToken, id } = body
  return client(`${api.constants.BASE_API_URL}/v1/${ROUTE}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then(api.utils.handleRefetchResponse)
}

export const EditOrganizationDetailsEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
  name: string
}): Promise<Organization> => {
  const { client, ...body } = payload
  const { accessToken, id, ...rest } = body
  return client(`${api.constants.BASE_API_URL}/v1/${ROUTE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(rest)
  }).then(api.utils.handleRefetchResponse)
}

export const CreateOrganizationEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  name: string
}): Promise<Organization> => {
  const { client, ...body } = payload
  const { accessToken, ...rest } = body
  return client(`${api.constants.BASE_API_URL}/v1/${ROUTE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(rest)
  }).then(api.utils.handleRefetchResponse)
}
