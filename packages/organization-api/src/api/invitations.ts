import { api } from 'api-authentication'
import {
  OrganizationInvitation,
  OrganizationMemberRole,
  PaginatedResponse,
  PaginationOptions
} from '~types'

const ROUTE = 'organizations'

export const GetOrganizationInvitationsEndpoint = async (
  payload: {
    client: api.client.ApiClient
    accessToken: string
    organizationId: string
  } & PaginationOptions
): Promise<PaginatedResponse<OrganizationInvitation>> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, current, limit } = body

  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/invitations?current=${current}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}

export const CreateOrganizationInvitationEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  organizationId: string
  email: string
  role: OrganizationMemberRole
}): Promise<OrganizationInvitation> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, ...rest } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/invitations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(rest)
    }
  ).then(api.utils.handleRefetchResponse)
}

export const ConfirmOrganizationInvitationEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  token: string
  organizationId: string
}): Promise<OrganizationInvitation> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, ...rest } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/invitations/confirm`,
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

export const DeleteOrganizationInvitationEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  id: string
  organizationId: string
}): Promise<OrganizationInvitation> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, id } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/invitations/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}

export const ResendOrganizationInvitationEndpoint = async (payload: {
  client: api.client.ApiClient
  accessToken: string
  organizationId: string
  id: string
}): Promise<void> => {
  const { client, ...body } = payload
  const { accessToken, organizationId, id } = body
  return client(
    `${api.constants.BASE_API_URL}/v1/${ROUTE}/${organizationId}/invitations/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(api.utils.handleRefetchResponse)
}
