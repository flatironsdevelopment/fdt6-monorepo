import { useCallback } from 'react'
import { configureRefreshFetch } from 'refresh-fetch'
import { ApiClient, apiClient } from '../api/client'
import { useTokenContext } from '../contexts/tokenContext'
import { getRefreshToken } from '../helpers/storage'
import { useRefreshToken } from './useRefreshToken'

interface UseApiClientHook {
  client: ApiClient
}

export const useApiClient = (): UseApiClientHook => {
  const { setTokens, removeTokens, refreshToken } = useTokenContext()
  const { getNewAccessToken } = useRefreshToken({ refreshToken: refreshToken })

  const shouldRefreshToken = (error: any) =>
    error.response.status === 401 && error.body.message === 'Token expired'

  const doRefreshToken = useCallback(async () => {
    const token = getRefreshToken()

    if (!token || !refreshToken) {
      removeTokens()
      return
    }

    try {
      const response = await getNewAccessToken()

      setTokens({
        token: response.accessToken,
        refreshToken
      })
    } catch (error) {
      removeTokens()
      throw error
    }
  }, [getNewAccessToken, refreshToken, removeTokens, setTokens])

  const client = configureRefreshFetch({
    fetch: apiClient,
    shouldRefreshToken,
    refreshToken: doRefreshToken
  })

  return {
    client
  }
}
