import { useMutation } from 'react-query'
import { User } from '~types'
import { ResendSignUpEndpoint } from '../api/recovery'
import { ConfirmSignUpEndpoint, SignUpEndpoint } from '../api/session'
import { DeliveryInfoResponse, FeatureState, GenericResponse } from '../types'

export interface UseSignUpHook {
  signUp: (
    user: Omit<User, 'emailVerified' | 'phoneNumberVerified' | 'mfaConfig'> & {
      password: string
    }
  ) => Promise<GenericResponse>
  confirmSignUp: (email: string, code: string) => Promise<GenericResponse>
  resendSignUpEmail: (email: string) => Promise<DeliveryInfoResponse>
  signUpState: FeatureState<GenericResponse>
  confirmSignUpState: FeatureState<GenericResponse>
  resendSignUpEmailState: FeatureState<DeliveryInfoResponse>
}

export const useSignUp = (): UseSignUpHook => {
  const signUpMutation = useMutation({
    mutationFn: SignUpEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const confirmSignUpMutation = useMutation({
    mutationFn: ConfirmSignUpEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const resendSignUpEmailMutation = useMutation({
    mutationFn: ResendSignUpEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const signUp = async (
    user: Omit<User, 'emailVerified' | 'phoneNumberVerified' | 'mfaConfig'> & {
      password: string
    }
  ) => {
    return await signUpMutation.mutateAsync({
      client: fetch,
      ...user
    })
  }

  const confirmSignUp = async (email: string, code: string) => {
    return await confirmSignUpMutation.mutateAsync({
      client: fetch,
      email,
      code
    })
  }

  const resendSignUpEmail = async (email: string) => {
    return await resendSignUpEmailMutation.mutateAsync({ client: fetch, email })
  }

  return {
    signUp,
    confirmSignUp,
    resendSignUpEmail,
    signUpState: {
      isLoading: signUpMutation.isLoading,
      isError: signUpMutation.isError,
      error: signUpMutation.error as Error,
      data: signUpMutation.data
    },
    confirmSignUpState: {
      isLoading: confirmSignUpMutation.isLoading,
      isError: confirmSignUpMutation.isError,
      error: confirmSignUpMutation.error as Error,
      data: confirmSignUpMutation.data
    },
    resendSignUpEmailState: {
      isLoading: resendSignUpEmailMutation.isLoading,
      isError: resendSignUpEmailMutation.isError,
      error: resendSignUpEmailMutation.error as Error,
      data: resendSignUpEmailMutation.data
    }
  }
}
