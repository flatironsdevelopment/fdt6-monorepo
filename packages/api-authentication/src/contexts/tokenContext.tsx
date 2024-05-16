import React, { createContext, useContext } from 'react'
import { useToken } from '../hooks/useToken'

export interface TokenContextValue {
  token?: string
  refreshToken?: string
  setTokens: (value: { token: string; refreshToken: string }) => void
  removeTokens: () => void
}

const TokenContext = createContext<TokenContextValue>({} as any)

export const useTokenContext = () => {
  const context = useContext(TokenContext)
  if (context === undefined) {
    throw new Error('useTokenContext must be within TokenContextProvider')
  }

  return context
}

export const TokenContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const { token, refreshToken, setTokens, removeTokens } = useToken()

  return (
    <TokenContext.Provider
      value={{
        token,
        refreshToken,
        setTokens,
        removeTokens
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
