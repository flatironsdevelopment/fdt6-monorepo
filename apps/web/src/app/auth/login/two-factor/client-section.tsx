'use client'

import { Links } from '@/app/auth/utils/constants'
import { styleProps } from '@/components/auth/pin-input'
import { Button } from '@/components/ui/button'
import { H3, Link, P } from '@/components/ui/typography'
import {
  Wrapper16,
  Wrapper24,
  Wrapper48,
  Wrapper8
} from '@/components/ui/wrapper'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { ChallengeNameType, useAuthContext } from 'api-authentication'
import { get, size } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import ReactCodeInput from 'react-code-input'

export const ConfirmLogin2FAClientSection = () => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const {
    verifySms,
    verifySmsState,
    verifyTOTP,
    verifyTOTPState,
    signInState
  } = useAuthContext()

  const [inputCodePin, setInputCodePin] = useState('')
  const [isCodeValid, setIsCodeValid] = useState(true)

  const router = useRouter()
  const challengeName = get(signInState, 'data.challengeName')

  const isAppAuthenticator =
    challengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA

  const user = get(signInState, 'data.userId', '')
  const session = get(signInState, 'data.session', '')

  const handleSubmitCode = useCallback(async () => {
    try {
      isAppAuthenticator
        ? await verifyTOTP(inputCodePin, user, session)
        : await verifySms(inputCodePin, user, session)

      router.push(`${Links.HOME}`)
    } catch (e) {
      setIsCodeValid(false)
      toast({
        title: get(e, 'body.message'),
        variant: 'error'
      })
    }
  }, [
    verifySms,
    verifyTOTP,
    router,
    session,
    user,
    toast,
    inputCodePin,
    isAppAuthenticator
  ])

  return (
    <Wrapper48 className="py-8 px-4 max-w-[592px] flex-col">
      <Wrapper16 columnDirection>
        <H3 className="text-center">{t('auth.two_factor_authentication')}</H3>
        <P className="text-center">{t('auth.add_code_sent_phone')}</P>
      </Wrapper16>

      <Wrapper24 className="flex-col text-center items-center">
        <Wrapper8 columnDirection>
          <ReactCodeInput
            autoFocus
            name="code"
            inputMode="numeric"
            fields={6}
            isValid={isCodeValid}
            onChange={setInputCodePin as any}
            {...styleProps}
          />
          {!isCodeValid && (
            <P className="text-error text-center">{t('auth.wrong_code')}</P>
          )}
        </Wrapper8>
      </Wrapper24>

      <Wrapper24 columnDirection center>
        <P>
          {t('auth.cant_get_code')}{' '}
          <Link href={Links.TWO_FACTOR}>{t('auth.use_other_method')}</Link>
        </P>

        <Button
          className="w-full"
          disabled={size(inputCodePin) < 6}
          isLoading={verifySmsState.isLoading || verifyTOTPState.isLoading}
          onClick={handleSubmitCode}
        >
          {t('auth.next')}
        </Button>
      </Wrapper24>
    </Wrapper48>
  )
}
