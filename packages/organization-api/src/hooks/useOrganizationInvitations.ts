import { useApiContext, usePagination } from 'api-authentication'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  OrganizationInvitation,
  OrganizationMemberRole,
  PaginatedResponse
} from '~types'
import {
  ConfirmOrganizationInvitationEndpoint,
  CreateOrganizationInvitationEndpoint,
  DeleteOrganizationInvitationEndpoint,
  GetOrganizationInvitationsEndpoint,
  ResendOrganizationInvitationEndpoint
} from '../api/invitations'

export interface UseOrganizationInvitationsHook {
  invitationsPagination: ReturnType<typeof usePagination>
  refetchInvitations: () => void
  invitationsState: {
    isLoading: boolean
    isError: boolean
    error: Error
    data: PaginatedResponse<OrganizationInvitation> | undefined
  }
  createInvitation: (
    email: string,
    role: OrganizationMemberRole
  ) => Promise<OrganizationInvitation | undefined>
  createInvitationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  confirmInvitation: (
    token: string
  ) => Promise<OrganizationInvitation | undefined>
  confirmInvitationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  resendInvitation: (id: string) => Promise<void>
  resendInvitationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  deleteInvitation: (id: string) => Promise<OrganizationInvitation | undefined>
  deleteInvitationState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
}

export const useOrganizationInvitations = ({
  accessToken,
  organizationId
}: {
  accessToken?: string
  organizationId?: string
}): UseOrganizationInvitationsHook => {
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
      'organization-invitations',
      {
        accessToken,
        organizationId,
        ...pagination
      }
    ],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token provided')

      if (!organizationId) throw new Error('No organization id provided')

      return await GetOrganizationInvitationsEndpoint({
        client,
        accessToken,
        organizationId,
        ...pagination
      })
    },
    enabled: !!accessToken && !!organizationId
  })

  const createOrganizationInvitationMutation = useMutation({
    mutationFn: CreateOrganizationInvitationEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === 'organization-invitations'
        }
      })
    },
    onError: () => {}
  })

  const confirmOrganizationInvitationMutation = useMutation({
    mutationFn: ConfirmOrganizationInvitationEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const resendOrganizationInvitationMutation = useMutation({
    mutationFn: ResendOrganizationInvitationEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const deleteOrganizationInvitationMutation = useMutation({
    mutationFn: DeleteOrganizationInvitationEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === 'organization-invitations'
        }
      })
    },
    onError: () => {}
  })

  const createInvitation = async (
    email: string,
    role: OrganizationMemberRole
  ) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await createOrganizationInvitationMutation.mutateAsync({
      client,
      accessToken,
      email,
      organizationId,
      role
    })
  }

  const confirmInvitation = async (token: string) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await confirmOrganizationInvitationMutation.mutateAsync({
      client,
      accessToken,
      organizationId,
      token
    })
  }

  const resendInvitation = async (id: string) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await resendOrganizationInvitationMutation.mutateAsync({
      client,
      accessToken,
      id,
      organizationId
    })
  }

  const deleteInvitation = async (id: string) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await deleteOrganizationInvitationMutation.mutateAsync({
      client,
      accessToken,
      id,
      organizationId
    })
  }

  return {
    invitationsPagination: pagination,
    refetchInvitations: query.refetch,
    invitationsState: {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error as Error,
      data: query.data
    },
    createInvitation,
    createInvitationState: {
      isLoading: createOrganizationInvitationMutation.isLoading,
      isError: createOrganizationInvitationMutation.isError,
      error: createOrganizationInvitationMutation.error as Error
    },
    confirmInvitation,
    confirmInvitationState: {
      isLoading: confirmOrganizationInvitationMutation.isLoading,
      isError: confirmOrganizationInvitationMutation.isError,
      error: confirmOrganizationInvitationMutation.error as Error
    },
    resendInvitation,
    resendInvitationState: {
      isLoading: resendOrganizationInvitationMutation.isLoading,
      isError: resendOrganizationInvitationMutation.isError,
      error: resendOrganizationInvitationMutation.error as Error
    },
    deleteInvitation,
    deleteInvitationState: {
      isLoading: deleteOrganizationInvitationMutation.isLoading,
      isError: deleteOrganizationInvitationMutation.isError,
      error: deleteOrganizationInvitationMutation.error as Error
    }
  }
}
