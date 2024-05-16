import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ApiContextProvider } from './apiContext'
import { AuthContextProvider } from './authContext'
import { TokenContextProvider } from './tokenContext'

const queryClient = new QueryClient()

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TokenContextProvider>
        <ApiContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ApiContextProvider>
      </TokenContextProvider>
    </QueryClientProvider>
  )
}
