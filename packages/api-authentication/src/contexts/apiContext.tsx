import React, { createContext, useContext } from 'react'
import { ApiClient } from '../api/client'
import { useApiClient } from '../hooks/useApi'

export interface ApiContextValue {
  client: ApiClient
}

const ApiContext = createContext<ApiContextValue>({} as any)

export const useApiContext = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApiContext must be within ApiContextProvider')
  }

  return context
}

export const ApiContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const { client } = useApiClient()

  return (
    <ApiContext.Provider
      value={{
        client
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}
