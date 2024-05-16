'use client'

import { FormHeader, OneSideSection } from '@/components/auth/common'
import { RecoveryForm } from '@/components/auth/recovery'
import { H3, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { useAuthContext } from 'api-authentication'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Links } from '../utils/constants'

export const RecoveryClientSection = () => {
  const {
    forgotPassword,
    forgotPasswordState: { isLoading }
  } = useAuthContext()
  const { t } = useTranslation()
  const router = useRouter()

  const params = useSearchParams()
  const email = params?.get('email') || ''

  const handleSubmit = useCallback(
    async ({ email }: { email: string }) => {
      await forgotPassword(email)
      router.push(`${Links.FORGOT_PASSWORD_CONFIRMATION}?email=${email}`)
    },
    [forgotPassword, router]
  )

  return (
    <OneSideSection className="bg-white">
      <FormHeader>
        <H3>{t('auth.recover_your_account')}</H3>
        <P>{t('auth.enter_email_reset_password')}</P>
      </FormHeader>
      <RecoveryForm
        email={email}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </OneSideSection>
  )
}
