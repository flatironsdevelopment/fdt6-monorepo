'use client'

import { Links } from '@/app/auth/utils/constants'
import { styleProps } from '@/components/auth/pin-input'
import { Button } from '@/components/ui/button'
import { H3, P } from '@/components/ui/typography'
import { Wrapper16, Wrapper48, Wrapper8 } from '@/components/ui/wrapper'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import { get, size } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { maskPhoneNumber } from 'utils'

export const ConfirmSMSCodeClientSection = () => {
  const {
    verifySms,
    verifySmsState,
    getSMSCode,
    userState,
    token: session
  } = useAuthContext()
  const { toast } = useToast()
  const { t } = useTranslation()

  const [inputCodePin, setInputCodePin] = useState('')
  const [isCodeValid, setIsCodeValid] = useState(true)

  const router = useRouter()
  const user = get(userState, 'data.user.id', '')
  const phoneNumber = get(userState, 'data.user.phoneNumber', '')

  const handleSubmitCode = useCallback(async () => {
    try {
      await verifySms(inputCodePin, user, session || '')
      router.push(`${Links.SUCCESS_TWO_FACTOR_SMS}`)
    } catch (e) {
      setIsCodeValid(false)
      toast({
        title: get(e, 'body.message'),
        variant: 'error'
      })
    }
  }, [verifySms, router, session, user, toast, inputCodePin])

  const handleResendSMS = useCallback(async () => {
    try {
      await getSMSCode()
      toast({
        title: t('auth.a_new_sms_was_sent')
      })
    } catch (e) {
      setIsCodeValid(false)
      toast({
        title: get(e, 'body.message'),
        variant: 'error'
      })
    }
  }, [getSMSCode, toast, t])

  // TODO: get the masked phone number from the request
  const maskedPhone = maskPhoneNumber(phoneNumber)

  return (
    <Wrapper48 className="py-8 px-4 max-w-[592px] flex-col">
      <Wrapper16 columnDirection>
        <H3 className="text-center">{t('auth.two_factor_authentication')}</H3>
        <P className="text-center">
          {t('auth.please_confirm_code')} {maskedPhone}
        </P>
      </Wrapper16>

      <Wrapper8 className="flex-col text-center">
        <ReactCodeInput
          name="code"
          inputMode="numeric"
          fields={6}
          isValid={isCodeValid}
          onChange={setInputCodePin as any}
          {...styleProps}
        />

        {!isCodeValid && <P className="text-error">{t('auth.wrong_code')}</P>}
      </Wrapper8>

      <div className="flex text-center flex-col">
        <P>{t('auth.take_a_minute_to_receive_code')}</P>
        <Button
          className="text-base font-semibold"
          variant="link"
          onClick={handleResendSMS}
        >
          {t('auth.resend_a_new_code')}
        </Button>
      </div>

      <Button
        disabled={size(inputCodePin) < 6}
        isLoading={verifySmsState.isLoading}
        onClick={handleSubmitCode}
      >
        {t('auth.next')}
      </Button>
    </Wrapper48>
  )
}
