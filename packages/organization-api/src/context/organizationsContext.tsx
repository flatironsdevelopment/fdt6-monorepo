import { usePagination } from 'api-authentication'
import { useTokenContext } from 'api-authentication/src/contexts/tokenContext'
import React, { createContext, useContext, useState } from 'react'
import { useOrganizationInvitations } from '../hooks/useOrganizationInvitations'
import { useOrganizationMembers } from '../hooks/useOrganizationMembers'
import { useOrganizations } from '../hooks/useOrganizations'

export interface OrganizationsContextValue
  extends ReturnType<typeof useOrganizations>,
    ReturnType<typeof useOrganizationInvitations>,
    ReturnType<typeof useOrganizationMembers> {
  organizationsPagination: ReturnType<typeof usePagination>
  invitationsPagination: ReturnType<typeof usePagination>
  membersPagination: ReturnType<typeof usePagination>
  setMemberId: (id: string) => void
  setOrganizationId: (id: string) => void
  organizationId: string | undefined
  memberId: string | undefined
}

const OrganizationsContext = createContext<OrganizationsContextValue>({} as any)

export const useOrganizationsContext = () => {
  const context = useContext(OrganizationsContext)

  if (context === undefined) {
    throw new Error(
      'useOrganizationsContext must be within OrganizationsContextProvider'
    )
  }

  return context
}

export const OrganizationsContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const { token } = useTokenContext()

  const [organizationId, setOrganizationId] = useState<string | undefined>()
  const [memberId, setMemberId] = useState<string | undefined>()

  const { ...organizations } = useOrganizations({
    accessToken: token,
    id: organizationId
  })

  const { ...invitations } = useOrganizationInvitations({
    accessToken: token,
    organizationId
  })

  const { ...members } = useOrganizationMembers({
    accessToken: token,
    organizationId,
    memberId
  })

  return (
    <OrganizationsContext.Provider
      value={{
        ...organizations,
        ...invitations,
        ...members,
        setMemberId,
        setOrganizationId,
        organizationId,
        memberId
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  )
}
