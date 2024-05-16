import { usePaginatedFeature } from 'api-authentication'
import { PaginationOptions } from '~types'
import { useOrganizationsContext } from '../context/organizationsContext'

export const useOrganizationsPagination = (options?: PaginationOptions) => {
  const { organizationsPagination, organizationsState } =
    useOrganizationsContext()

  const {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  } = usePaginatedFeature({
    ...options,
    key: 'organizations',
    featureState: organizationsState,
    pagination: organizationsPagination
  })

  return {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  }
}

export const useOrganizationMembersPagination = (
  options?: PaginationOptions
) => {
  const { membersPagination, membersState } = useOrganizationsContext()

  const {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  } = usePaginatedFeature({
    ...options,
    key: 'organization-members',
    featureState: membersState,
    pagination: membersPagination
  })

  return {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  }
}

export const useOrganizationInvitationsPagination = (
  options?: PaginationOptions
) => {
  const { invitationsPagination, invitationsState } = useOrganizationsContext()

  const {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  } = usePaginatedFeature({
    ...options,
    key: 'organization-invitations',
    featureState: invitationsState,
    pagination: invitationsPagination
  })

  return {
    current,
    limit,
    setPage,
    changeLimit,
    goToNextPage,
    goToPreviousPage
  }
}
