'use client'

import { FormHeader } from '@/components/auth/common'
import { SMSForm } from '@/components/auth/two-factor/sms-form'
import { ValidationSchema } from '@/components/auth/verification'
import { H3, P } from '@/components/ui/typography'
import { useTranslation } from '@/i18n/useTranslation'
import { useAuthContext } from 'api-authentication'
import { get } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { Links } from '../../utils/constants'

export const SendSMSClientSection = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { getSMSCode, getSmsCodeState, userState } = useAuthContext()
  const phoneNumber = get(userState, 'data.user.phoneNumber')

  const handleGetSMSCode: SubmitHandler<ValidationSchema> =
    useCallback(async () => {
      await getSMSCode()
      router.push(`${Links.CONFIRM_TWO_FACTOR_SMS}`)
    }, [getSMSCode, router])

  return (
    <div className="py-8 px-4 max-w-[592px]">
      <FormHeader>
        <H3>{t('auth.two_factor_authentication')}</H3>
        <P>{t('auth.you_will_receive_a_sms')}</P>
      </FormHeader>

      <SMSForm
        isLoading={getSmsCodeState.isLoading}
        phoneNumber={phoneNumber}
        handleSubmit={handleGetSMSCode}
      />
    </div>
  )
}
