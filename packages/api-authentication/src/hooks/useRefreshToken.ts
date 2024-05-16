import { useMutation } from 'react-query'
import { RefreshTokenEndpoint } from '../api/session'
import { useTokenContext } from '../contexts/tokenContext'
import { FeatureState } from '../types'

export interface UseRefreshTokenHook {
  getNewAccessToken: () => Promise<{
    accessToken: string
  }>
  refreshTokenState: FeatureState<{
    accessToken: string
  }>
}

export const useRefreshToken = ({
  refreshToken
}: {
  refreshToken?: string
}): UseRefreshTokenHook => {
  const { setTokens } = useTokenContext()

  const refreshTokenMutation = useMutation({
    mutationFn: RefreshTokenEndpoint,
    onSuccess: (body) => {
      if (!refreshToken) throw new Error('No refresh token provided')
      setTokens({ token: body.accessToken, refreshToken: refreshToken })
    },
    onError: () => {}
  })

  const getNewAccessToken = async () => {
    if (!refreshToken) throw new Error('No refresh token provided')

    return await refreshTokenMutation.mutateAsync({
      client: fetch,
      token: refreshToken
    })
  }

  return {
    getNewAccessToken,
    refreshTokenState: {
      isLoading: refreshTokenMutation.isLoading,
      isError: refreshTokenMutation.isError,
      error: refreshTokenMutation.error as Error,
      data: refreshTokenMutation.data
    }
  }
}
