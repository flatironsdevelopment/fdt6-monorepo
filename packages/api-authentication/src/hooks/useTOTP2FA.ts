import { useMutation, useQueryClient } from 'react-query'
import {
  DisableTOTPMfaEndpoint,
  EnableTOTPMfaEndpoint,
  GetTOTPQRCodeEndpoint,
  TOTPQRCodeFormat,
  TOTPQRCodeType,
  VerifyTOTPEndpoint
} from '../api/totp'
import { useApiContext } from '../contexts/apiContext'
import { useTokenContext } from '../contexts/tokenContext'
import { FeatureState, GenericResponse, QRCode, SessionTokens } from '../types'

export interface UseTOTP2FAHook {
  getTOTPQRCode: (
    qrType?: TOTPQRCodeType,
    qrFormat?: TOTPQRCodeFormat
  ) => Promise<QRCode>
  enableTOTPMfa: (code: string) => Promise<GenericResponse>
  disableTOTPMfa: () => Promise<GenericResponse>
  verifyTOTP: (
    code: string,
    user: string,
    session: string
  ) => Promise<SessionTokens>
  getTOTPQRCodeState: FeatureState<QRCode>
  enableTOTPState: FeatureState<GenericResponse>
  disableTOTPState: FeatureState<GenericResponse>
  verifyTOTPState: FeatureState<SessionTokens>
}

export const useTOTP2FA = ({
  accessToken
}: {
  accessToken?: string
}): UseTOTP2FAHook => {
  const { client } = useApiContext()
  const queryClient = useQueryClient()
  const { setTokens } = useTokenContext()

  const getTOTPQRCodeMutation = useMutation({
    mutationFn: GetTOTPQRCodeEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const enableTOTPMutation = useMutation({
    mutationFn: EnableTOTPMfaEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const disableTOTPMutation = useMutation({
    mutationFn: DisableTOTPMfaEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const verifyTOTPMutation = useMutation({
    mutationFn: VerifyTOTPEndpoint,
    onSuccess: ({ accessToken, refreshToken }) => {
      if (accessToken && refreshToken) {
        setTokens({ token: accessToken, refreshToken: refreshToken })
      }
    },
    onError: () => {}
  })

  const getTOTPQRCode = async (
    qrType: TOTPQRCodeType = TOTPQRCodeType.TEXT,
    qrFormat: TOTPQRCodeFormat = TOTPQRCodeFormat.SVG
  ) => {
    if (!accessToken) throw new Error('No access token provided')

    return await getTOTPQRCodeMutation.mutateAsync({
      client,
      accessToken,
      qrType,
      qrFormat
    })
  }

  const enableTOTPMfa = async (code: string) => {
    if (!accessToken) throw new Error('No access token provided')

    return await enableTOTPMutation.mutateAsync({ client, accessToken, code })
  }

  const disableTOTPMfa = async () => {
    if (!accessToken) throw new Error('No access token provided')

    return await disableTOTPMutation.mutateAsync(
      { client, accessToken },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('user')
        }
      }
    )
  }

  const verifyTOTP = async (code: string, user: string, session: string) => {
    return await verifyTOTPMutation.mutateAsync({
      client,
      code,
      user,
      session
    })
  }

  return {
    getTOTPQRCode,
    enableTOTPMfa,
    disableTOTPMfa,
    verifyTOTP,
    enableTOTPState: {
      isLoading: enableTOTPMutation.isLoading,
      isError: enableTOTPMutation.isError,
      error: enableTOTPMutation.error as Error,
      data: enableTOTPMutation.data
    },
    disableTOTPState: {
      isLoading: disableTOTPMutation.isLoading,
      isError: disableTOTPMutation.isError,
      error: disableTOTPMutation.error as Error,
      data: disableTOTPMutation.data
    },
    verifyTOTPState: {
      isLoading: verifyTOTPMutation.isLoading,
      isError: verifyTOTPMutation.isError,
      error: verifyTOTPMutation.error as Error,
      data: verifyTOTPMutation.data
    },
    getTOTPQRCodeState: {
      isLoading: getTOTPQRCodeMutation.isLoading,
      isError: getTOTPQRCodeMutation.isError,
      error: getTOTPQRCodeMutation.error as Error,
      data: getTOTPQRCodeMutation.data
    }
  }
}
