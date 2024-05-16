import { useMutation, useQueryClient } from 'react-query'
import {
  DisableSMSMfaEndpoint,
  EnableSMSMfaEndpoint,
  GetSMSCodeEndpoint,
  VerifySMSEndpoint
} from '../api/sms'
import { useApiContext } from '../contexts/apiContext'
import { useTokenContext } from '../contexts/tokenContext'
import {
  DeliveryInfoResponse,
  FeatureState,
  GenericResponse,
  SessionTokens
} from '../types'

export interface UseSMS2FAHook {
  enableSMSMfa: (code: string) => Promise<GenericResponse>
  disableSMSMfa: () => Promise<GenericResponse>
  verifySms: (
    code: string,
    user: string,
    session: string
  ) => Promise<SessionTokens>
  getSMSCode: () => Promise<DeliveryInfoResponse>
  enableSMSMfaState: FeatureState<GenericResponse>
  disableSMSMfaState: FeatureState<GenericResponse>
  verifySmsState: FeatureState<SessionTokens>
  getSmsCodeState: FeatureState<DeliveryInfoResponse>
}

export const useSMS2FA = ({
  accessToken
}: {
  accessToken?: string
}): UseSMS2FAHook => {
  const { client } = useApiContext()
  const queryClient = useQueryClient()
  const { setTokens } = useTokenContext()

  const getSMSCodeMutation = useMutation({
    mutationFn: GetSMSCodeEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const enableSMSMfaMutation = useMutation({
    mutationFn: EnableSMSMfaEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const disableSMSMfaMutation = useMutation({
    mutationFn: DisableSMSMfaEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const verifySMSMutation = useMutation({
    mutationFn: VerifySMSEndpoint,
    onSuccess: ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        setTokens({ token: accessToken, refreshToken: refreshToken })
      }
    },
    onError: () => {}
  })

  const getSMSCode = async () => {
    if (!accessToken) throw new Error('No access token provided')

    return await getSMSCodeMutation.mutateAsync({
      client,
      accessToken
    })
  }

  const enableSMSMfa = async (code: string) => {
    if (!accessToken) throw new Error('No access token provided')

    return await enableSMSMfaMutation.mutateAsync({ client, accessToken, code })
  }

  const disableSMSMfa = async () => {
    if (!accessToken) throw new Error('No access token provided')

    return await disableSMSMfaMutation.mutateAsync(
      { client, accessToken },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('user')
        }
      }
    )
  }

  const verifySms = async (code: string, user: string, session: string) => {
    return await verifySMSMutation.mutateAsync({ client, code, user, session })
  }

  return {
    enableSMSMfa,
    disableSMSMfa,
    verifySms,
    getSMSCode,
    enableSMSMfaState: {
      isLoading: enableSMSMfaMutation.isLoading,
      isError: enableSMSMfaMutation.isError,
      error: enableSMSMfaMutation.error as Error,
      data: enableSMSMfaMutation.data
    },
    disableSMSMfaState: {
      isLoading: disableSMSMfaMutation.isLoading,
      isError: disableSMSMfaMutation.isError,
      error: disableSMSMfaMutation.error as Error,
      data: disableSMSMfaMutation.data
    },
    verifySmsState: {
      isLoading: verifySMSMutation.isLoading,
      isError: verifySMSMutation.isError,
      error: verifySMSMutation.error as Error,
      data: verifySMSMutation.data
    },
    getSmsCodeState: {
      isLoading: getSMSCodeMutation.isLoading,
      isError: getSMSCodeMutation.isError,
      error: getSMSCodeMutation.error as Error,
      data: getSMSCodeMutation.data
    }
  }
}
