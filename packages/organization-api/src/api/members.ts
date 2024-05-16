import { api } from 'api-authentication'
import {
  OrganizationMember,
  OrganizationMemberRole,
  PaginatedResponse,
  PaginationOptions
} from '~types'

const ROUTE = 'organizations'

export const GetOrganizationMembersEndpoint = async (
  payload: {
    client: api.client.ApiClient
    accessToken: string
    organizationId: string
  } & PaginationOptions
): Promise<PaginatedResponse<OrganizationMember>> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, current, limit } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/members?current=${current}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}

export const GetOrganizationMemberDetailsEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
  organizationId: string
}): Promise<OrganizationMember> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, id } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/members/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}

export const EditOrganizationMemberDetailsEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
  organizationId: string
  role: OrganizationMemberRole
}): Promise<OrganizationMember> => {
  const { client, ...body } = payload
  const { accessToken, id, organizationId, ...rest } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/members/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(rest)
    }
  ).then(api.utils.handleRefetchResponse)
}

export const DeleteOrganizationMemberEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
  organizationId: string
}): Promise<OrganizationMember> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, id } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/members/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}
