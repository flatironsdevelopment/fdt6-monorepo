import { useApiContext, usePagination } from 'api-authentication'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  OrganizationMember,
  OrganizationMemberRole,
  PaginatedResponse
} from '~types'
import {
  DeleteOrganizationMemberEndpoint,
  EditOrganizationMemberDetailsEndpoint,
  GetOrganizationMemberDetailsEndpoint,
  GetOrganizationMembersEndpoint
} from '../api/members'

export interface UseOrganizationMembersHook {
  membersPagination: ReturnType<typeof usePagination>
  refetchMembers: () => void
  membersState: {
    isLoading: boolean
    isError: boolean
    error: Error
    data: PaginatedResponse<OrganizationMember> | undefined
  }
  deleteMember: (id: string) => Promise<OrganizationMember | undefined>
  deleteMemberState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  editMember: (
    id: string,
    role: OrganizationMemberRole
  ) => Promise<OrganizationMember | undefined>
  editMemberState: {
    isLoading: boolean
    isError: boolean
    error: Error
  }
  refetchMemberDetails: () => void
  memberDetailsState: {
    isLoading: boolean
    isError: boolean
    error: Error
    data: OrganizationMember | undefined
  }
}

export const useOrganizationMembers = ({
  accessToken,
  organizationId,
  memberId
}: {
  accessToken?: string
  organizationId?: string
  memberId?: string
}): UseOrganizationMembersHook => {
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
      'organization-members',
      {
        accessToken,
        organizationId,
        ...pagination
      }
    ],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token provided')

      if (!organizationId) throw new Error('No organization id provided')

      return await GetOrganizationMembersEndpoint({
        client,
        accessToken,
        organizationId,
        ...pagination
      })
    },
    enabled: !!accessToken && !!organizationId
  })

  const memberQuery = useQuery({
    queryKey: [
      'organization-member-details',
      {
        accessToken,
        organizationId,
        id: memberId
      }
    ],
    initialData: {
      data: [],
      pagination: {
        total: 0,
        limit: 0,
        current: 0
      }
    } as any,
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token provided')

      if (!organizationId) throw new Error('No organization id provided')

      if (!memberId) throw new Error('No organization member id provided')

      return await GetOrganizationMemberDetailsEndpoint({
        client,
        accessToken,
        organizationId,
        id: memberId
      })
    },
    enabled: !!accessToken && !!organizationId && !!memberId
  })

  const editOrganizationMemberMutation = useMutation({
    mutationFn: EditOrganizationMemberDetailsEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === 'organization-members'
        }
      })
    },
    onError: () => {}
  })

  const deleteOrganizationMemberMutation = useMutation({
    mutationFn: DeleteOrganizationMemberEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate(query) {
          return query.queryKey[0] === 'organization-members'
        }
      })
    },
    onError: () => {}
  })

  const editMember = async (id: string, role: OrganizationMemberRole) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await editOrganizationMemberMutation.mutateAsync({
      client,
      accessToken,
      organizationId,
      role,
      id
    })
  }

  const deleteMember = async (id: string) => {
    if (!accessToken || !organizationId) {
      return
    }

    return await deleteOrganizationMemberMutation.mutateAsync({
      client,
      accessToken,
      organizationId,
      id
    })
  }

  return {
    membersPagination: pagination,
    refetchMembers: query.refetch,
    membersState: {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error as Error,
      data: query.data
    },
    deleteMember,
    deleteMemberState: {
      isLoading: deleteOrganizationMemberMutation.isLoading,
      isError: deleteOrganizationMemberMutation.isError,
      error: deleteOrganizationMemberMutation.error as Error
    },
    editMember,
    editMemberState: {
      isLoading: editOrganizationMemberMutation.isLoading,
      isError: editOrganizationMemberMutation.isError,
      error: editOrganizationMemberMutation.error as Error
    },
    refetchMemberDetails: memberQuery.refetch,
    memberDetailsState: {
      isLoading: memberQuery.isLoading,
      isError: memberQuery.isError,
      error: memberQuery.error as Error,
      data: memberQuery.data
    }
  }
}
