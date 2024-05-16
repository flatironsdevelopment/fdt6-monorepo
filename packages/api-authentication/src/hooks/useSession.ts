import {
  QueryObserverResult,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import { User } from '~types'
import { ChangePasswordEndpoint } from '../api/recovery'
import {
  GetSessionEndpoint,
  SignInEndpoint,
  SignOutEndpoint
} from '../api/session'
import { useApiContext } from '../contexts/apiContext'
import { useTokenContext } from '../contexts/tokenContext'
import { FeatureState, GenericResponse, SignInStateType } from '../types'

export interface UseSessionHook {
  signIn: (email: string, password: string) => Promise<SignInStateType>
  signOut: () => Promise<GenericResponse | undefined>
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<GenericResponse | undefined>
  getUser: () => Promise<QueryObserverResult<User, unknown>>
  signInState: FeatureState<SignInStateType>
  signOutState: FeatureState<GenericResponse>
  changePasswordState: FeatureState<GenericResponse>
  userState: FeatureState<User>
}

export const useSession = ({
  accessToken
}: {
  accessToken?: string
}): UseSessionHook => {
  const queryClient = useQueryClient()
  const { setTokens, removeTokens } = useTokenContext()
  const { client } = useApiContext()

  const query = useQuery(
    ['user', accessToken],
    async () => {
      if (!accessToken) throw new Error('No access token provided')
      return await GetSessionEndpoint({ client, accessToken })
    },
    {
      enabled: !!accessToken
    }
  )

  const signInMutation = useMutation({
    mutationFn: SignInEndpoint,
    onSuccess: (body: any) => {
      if (body.accessToken && body.refreshToken) {
        setTokens({ token: body.accessToken, refreshToken: body.refreshToken })
      }
      queryClient.invalidateQueries('user')
    },
    onError: () => {}
  })

  const signOutMutation = useMutation({
    mutationFn: SignOutEndpoint,
    onSuccess: () => {
      removeTokens()
    },
    onError: () => {}
  })

  const changePasswordMutation = useMutation({
    mutationFn: ChangePasswordEndpoint,
    onSuccess: () => {},
    onError: () => {}
  })

  const signIn = async (email: string, password: string) => {
    return await signInMutation.mutateAsync({ client: fetch, email, password })
  }

  const signOut = async () => {
    if (!accessToken) {
      return
    }
    return await signOutMutation.mutateAsync({ client, accessToken })
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!accessToken) {
      return
    }

    return await changePasswordMutation.mutateAsync({
      client,
      accessToken,
      oldPassword,
      newPassword
    })
  }

  return {
    signIn,
    signOut,
    changePassword,
    getUser: query.refetch,
    signInState: {
      isLoading: signInMutation.isLoading,
      isError: signInMutation.isError,
      error: signInMutation.error as Error,
      data: signInMutation.data
    },
    signOutState: {
      isLoading: signOutMutation.isLoading,
      isError: signOutMutation.isError,
      error: signOutMutation.error as Error,
      data: signOutMutation.data
    },
    changePasswordState: {
      isLoading: changePasswordMutation.isLoading,
      isError: changePasswordMutation.isError,
      error: changePasswordMutation.error as Error,
      data: changePasswordMutation.data
    },
    userState: {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error as Error,
      data: query.data
    }
  }
}
