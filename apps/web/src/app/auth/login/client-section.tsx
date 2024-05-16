'use client'

import { FormHeader, OneSideSection } from '@/components/auth/common'
import { LoginForm } from '@/components/auth/login'
import { H3, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { ChallengeNameType, useAuthContext } from 'api-authentication'
import { get } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Links } from '../utils/constants'

export type LoginProps = {
  identifier: string
  password: string
}

export type Login2FAProps = {
  identifier: string
  password: string
  token: string
}

export const LoginFormClientSection = () => {
  const {
    signIn,
    signInState: { isLoading, isError, error }
  } = useAuthContext()

  const { t } = useTranslation()

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = useCallback(
    async ({ identifier, password }: LoginProps) => {
      try {
        const loginData = await signIn(identifier, password)

        const hasTwoFactor =
          get(loginData, 'challengeName') ===
          ChallengeNameType.SOFTWARE_TOKEN_MFA

        if (hasTwoFactor) {
          return router.push(Links.LOGIN_2FA)
        }

        toast({
          title: t('auth.logged_in'),
          variant: 'success'
        })
      } catch (e) {
        const { message: title } = e as Error
        toast({
          title,
          variant: 'error'
        })
      }
    },
    [signIn] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <OneSideSection className="bg-white">
      <FormHeader>
        <H3>{t('auth.sign_in')}</H3>
        <P>{t('auth.provide_details')}</P>
      </FormHeader>

      <LoginForm isLoading={isLoading} handleSubmit={handleSubmit} />

      {error?.message}
    </OneSideSection>
  )
}
