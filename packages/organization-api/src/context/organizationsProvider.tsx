import React from 'react'
import { OrganizationsContextProvider } from './organizationsContext'

export const OrganizationsProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  return <OrganizationsContextProvider>{children}</OrganizationsContextProvider>
}
