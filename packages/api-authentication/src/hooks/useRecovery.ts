import { useMutation } from 'react-query'
import {
  ForgotPasswordEndpoint,
  ForgotPasswordSubmitEndpoint
} from '../api/recovery'
import { DeliveryInfoResponse, FeatureState, GenericResponse } from '../types'

export interface UseRecoveryHook {
  forgotPassword: (email: string) => Promise<DeliveryInfoResponse>
  forgotPasswordSubmit: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<GenericResponse>
  forgotPasswordState: FeatureState<DeliveryInfoResponse>
  forgotPasswordSubmitState: FeatureState<GenericResponse>
}

export const useRecovery = (): UseRecoveryHook => {
  const forgotPasswordMutation = useMutation({
    mutationFn: ForgotPasswordEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const forgotPasswordSubmitMutation = useMutation({
    mutationFn: ForgotPasswordSubmitEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const forgotPassword = async (email: string) => {
    return await forgotPasswordMutation.mutateAsync({ email, client: fetch })
  }

  const forgotPasswordSubmit = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    return await forgotPasswordSubmitMutation.mutateAsync({
      client: fetch,
      email,
      code,
      newPassword
    })
  }

  return {
    forgotPassword,
    forgotPasswordSubmit,
    forgotPasswordState: {
      isLoading: forgotPasswordMutation.isLoading,
      isError: forgotPasswordMutation.isError,
      error: forgotPasswordMutation.error as Error,
      data: forgotPasswordMutation.data
    },
    forgotPasswordSubmitState: {
      isLoading: forgotPasswordSubmitMutation.isLoading,
      isError: forgotPasswordSubmitMutation.isError,
      error: forgotPasswordSubmitMutation.error as Error,
      data: forgotPasswordSubmitMutation.data
    }
  }
}
