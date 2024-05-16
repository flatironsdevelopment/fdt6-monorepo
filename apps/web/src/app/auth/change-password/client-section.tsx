'use client'

import {
  ChangePasswordForm,
  ValidationSchema
} from '@/components/auth/change-password'
import { CenterSection, FormHeader } from '@/components/auth/common'
import { MobileHeader } from '@/components/ui/header'
import { H3, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import { useCallback } from 'react'
import { SubmitHandler } from 'react-hook-form'

export const ChangePasswordClient = () => {
  const {
    changePassword,
    changePasswordState: { isLoading }
  } = useAuthContext()

  const { t } = useTranslation()

  const { toast } = useToast()

  const handleSubmit: SubmitHandler<ValidationSchema> = useCallback(
    async ({ password, confirmPassword }) => {
      try {
        await changePassword(password, confirmPassword)

        toast({
          title: t('auth.password_changed'),
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
    [changePassword, toast, t]
  )

  return (
    <>
      <MobileHeader />

      <CenterSection>
        <div className=" w-full">
          <FormHeader>
            <H3>{t('auth.change_password')}</H3>
            <P>{t('auth.enter_your_new_password_here')}</P>
          </FormHeader>
          <ChangePasswordForm
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </CenterSection>
    </>
  )
}
