import { useApiContext, usePagination } from 'api-authentication'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Organization, PaginatedResponse } from '~types'
import {
  CreateOrganizationEndpoint,
  EditOrganizationDetailsEndpoint,
  GetOrganizationDetailsEndpoint,
  GetOrganizationsEndpoint
} from '../api/organizations'

export interface UseOrganizationHook {
  organizationsPagination: ReturnType<typeof usePagination>
  refetchOrganizations: () => void
  organizationsState: {
    isLoading: boolean
    isError: boolean
    error: Error
    data: PaginatedResponse<Organization> | undefined
  }
  createOrganization: (name: string) => Promise<Organization | undefined>
  createOrganizationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  refetchOrganizationDetails: () => void
  organizationDetailsState: {
    isLoading: boolean
    isError: boolean
    error: Error
    data: Organization | undefined
  }
  editOrganization: (name: string) => Promise<Organization | undefined>
  editOrganizationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
}

export const useOrganizations = ({
  accessToken,
  id
}: {
  accessToken?: string
  id?: string
}): UseOrganizationHook => {
  const { client } = useApiContext()
  const queryClient = useQueryClient()
  const pagination = usePagination({
    limit: 10,
    current: 1
  })

  const query = useQuery({
    initialData: {
      data: [],
      pagination: {
        next: '',
        previous: '',
        limit: 0,
        current: 0,
        totalCount: 0,
        totalPages: 0
      }
    },
    queryKey: [
      'organizations',
      {
        accessToken,
        ...pagination
      }
    ],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token provided')

      return await GetOrganizationsEndpoint({
        client,
        accessToken,
        ...pagination
      })
    },
    enabled: !!accessToken
  })

  const organizationQuery = useQuery(
    [
      'organization-details',
      {
        accessToken,
        id
      }
    ],
    async () => {
      if (!accessToken) throw new Error('No access token provided')

      if (!id) throw new Error('No organization id provided')

      return await GetOrganizationDetailsEndpoint({
        client,
        accessToken,
        id
      })
    },
    {
      enabled: !!accessToken && !!id
    }
  )

  const createOrganizationMutation = useMutation({
    mutationFn: CreateOrganizationEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === 'organizations'
        }
      })
    },
    onError: () => {}
  })

  const editOrganizationMutation = useMutation({
    mutationFn: EditOrganizationDetailsEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === 'organization-details'
        }
      })
    },
    onError: () => {}
  })

  const createOrganization = async (name: string) => {
    if (!accessToken) {
      return
    }

    return await createOrganizationMutation.mutateAsync({
      client,
      accessToken,
      name
    })
  }

  const editOrganization = async (name: string) => {
    if (!accessToken || !id) {
      return
    }

    return await editOrganizationMutation.mutateAsync({
      client,
      accessToken,
      id,
      name
    })
  }

  return {
    organizationsPagination: pagination,
    refetchOrganizations: query.refetch,
    organizationsState: {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error as Error,
      data: query.data
    },
    createOrganization,
    createOrganizationState: {
      isLoading: createOrganizationMutation.isLoading,
      isError: createOrganizationMutation.isError,
      error: createOrganizationMutation.error as Error
    },
    refetchOrganizationDetails: organizationQuery.refetch,
    organizationDetailsState: {
      isLoading: organizationQuery.isLoading,
      isError: organizationQuery.isError,
      error: organizationQuery.error as Error,
      data: organizationQuery.data
    },
    editOrganization,
    editOrganizationState: {
      isLoading: editOrganizationMutation.isLoading,
      isError: editOrganizationMutation.isError,
      error: editOrganizationMutation.error as Error
    }
  }
}
