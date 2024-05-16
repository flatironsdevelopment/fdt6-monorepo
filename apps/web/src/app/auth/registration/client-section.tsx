'use client'

import { FormHeader, OneSideScrollSection } from '@/components/auth/common'
import { RegistrationForm } from '@/components/auth/register'
import { H3 } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import { useCallback } from 'react'

type Props = {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
}

export const RegistrationClientSection = () => {
  const {
    signUp,
    signUpState: { isLoading }
  } = useAuthContext()
  const { t } = useTranslation()
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async ({ firstName, lastName, phoneNumber, email, password }: any) => {
      try {
        await signUp({
          id: firstName,
          firstName,
          lastName,
          email,
          password,
          phoneNumber
        })
      } catch (e) {
        const { message: title } = e as Error
        toast({
          title,
          variant: 'error'
        })
      }
    },
    [signUp, toast]
  )

  return (
    <OneSideScrollSection>
      <FormHeader>
        <H3>{t('auth.create_your_account')}</H3>
        <p>{t('auth.create_your_account')}</p>
      </FormHeader>
      <RegistrationForm isLoading={isLoading} handleSubmit={handleSubmit} />
    </OneSideScrollSection>
  )
}
