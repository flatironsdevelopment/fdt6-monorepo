import React, { createContext, useContext, useEffect } from 'react'
import { UseRecoveryHook, useRecovery } from '../hooks/useRecovery'
import { UseRefreshTokenHook, useRefreshToken } from '../hooks/useRefreshToken'
import { UseSMS2FAHook, useSMS2FA } from '../hooks/useSMS2FA'
import { UseSessionHook, useSession } from '../hooks/useSession'
import { UseSignUpHook, useSignUp } from '../hooks/useSignUp'
import { UseTOTP2FAHook, useTOTP2FA } from '../hooks/useTOTP2FA'
import { UseTokenHook } from '../hooks/useToken'
import { useTokenContext } from './tokenContext'

export interface AuthContextValue
  extends Omit<UseTokenHook, 'setTokens' | 'removeTokens'>,
    UseRecoveryHook,
    UseRefreshTokenHook,
    UseSessionHook,
    UseSignUpHook,
    UseSMS2FAHook,
    UseTOTP2FAHook {}

const AuthContext = createContext<AuthContextValue>({} as any)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be within AuthContextProvider')
  }

  return context
}

export const AuthContextProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const { token, refreshToken } = useTokenContext()

  const { refreshTokenState, getNewAccessToken } = useRefreshToken({
    refreshToken
  })

  const {
    signIn,
    signOut,
    changePassword,
    getUser,
    signInState,
    signOutState,
    changePasswordState,
    userState
  } = useSession({ accessToken: token })

  const {
    forgotPassword,
    forgotPasswordSubmit,
    forgotPasswordState,
    forgotPasswordSubmitState
  } = useRecovery()

  const {
    signUp,
    confirmSignUp,
    resendSignUpEmail,
    signUpState,
    confirmSignUpState,
    resendSignUpEmailState
  } = useSignUp()

  const {
    enableSMSMfa,
    disableSMSMfa,
    verifySms,
    getSMSCode,
    enableSMSMfaState,
    disableSMSMfaState,
    verifySmsState,
    getSmsCodeState
  } = useSMS2FA({ accessToken: token })

  const {
    getTOTPQRCode,
    enableTOTPMfa,
    disableTOTPMfa,
    verifyTOTP,
    enableTOTPState,
    disableTOTPState,
    verifyTOTPState,
    getTOTPQRCodeState
  } = useTOTP2FA({
    accessToken: token
  })

  useEffect(() => {
    if (token) {
      getUser()
    }
  }, [token, getUser])

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        getNewAccessToken,
        refreshTokenState,
        signIn,
        signOut,
        changePassword,
        getUser,
        signInState,
        signOutState,
        changePasswordState,
        userState,
        forgotPassword,
        forgotPasswordSubmit,
        forgotPasswordState,
        forgotPasswordSubmitState,
        signUp,
        confirmSignUp,
        resendSignUpEmail,
        signUpState,
        confirmSignUpState,
        resendSignUpEmailState,
        enableSMSMfa,
        disableSMSMfa,
        verifySms,
        getSMSCode,
        enableSMSMfaState,
        disableSMSMfaState,
        verifySmsState,
        getSmsCodeState,
        getTOTPQRCode,
        enableTOTPMfa,
        disableTOTPMfa,
        verifyTOTP,
        enableTOTPState,
        disableTOTPState,
        verifyTOTPState,
        getTOTPQRCodeState
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
