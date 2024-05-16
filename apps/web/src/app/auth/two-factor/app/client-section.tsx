'use client'

import { Links } from '@/app/auth/utils/constants'
import { styleProps } from '@/components/auth/pin-input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { H3, P } from '@/components/ui/typography'
import {
  Wrapper16,
  Wrapper24,
  Wrapper48,
  Wrapper8
} from '@/components/ui/wrapper'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import {
  TOTPQRCodeFormat,
  TOTPQRCodeType
} from 'api-authentication/src/api/totp'
import { get, size } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ReactCodeInput from 'react-code-input'

export const ConfirmAuthAppCodeClientSection = () => {
  const { toast } = useToast()
  const { t } = useTranslation()
  const {
    getTOTPQRCode,
    getTOTPQRCodeState,
    enableTOTPMfa,
    enableTOTPState,
    token: session
  } = useAuthContext()

  const src = getTOTPQRCodeState?.data
    ? URL.createObjectURL(getTOTPQRCodeState?.data as any)
    : ''

  const [inputCodePin, setInputCodePin] = useState('')
  const [isCodeValid, setIsCodeValid] = useState(true)

  const router = useRouter()

  const handleSubmitCode = useCallback(async () => {
    try {
      await enableTOTPMfa(inputCodePin)
      router.push(`${Links.SUCCESS_TWO_FACTOR_APP}`)
    } catch (e) {
      setIsCodeValid(false)
      toast({
        title: get(e, 'body.message'),
        variant: 'error'
      })
    }
  }, [enableTOTPMfa, router, toast, inputCodePin])

  useEffect(() => {
    if (session) {
      getTOTPQRCode(TOTPQRCodeType.IMAGE, TOTPQRCodeFormat.UTF8)
    }
  }, [session, getTOTPQRCode])

  return (
    <Wrapper48 className="py-8 px-4 max-w-[592px] flex-col">
      <Wrapper16 columnDirection>
        <H3 className="text-center">{t('auth.two_factor_authentication')}</H3>
        <P className="text-center">{t('auth.you_need_scan_this_qr')}</P>
      </Wrapper16>

      <Wrapper24 className="flex-col text-center items-center">
        {src ? (
          <Image
            width={144}
            height={144}
            src={src}
            alt="2 factor authentication qr-code"
          />
        ) : (
          <Skeleton className="h-36 w-36" />
        )}

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

      <Button
        disabled={size(inputCodePin) < 6}
        isLoading={enableTOTPState.isLoading}
        onClick={handleSubmitCode}
      >
        {t('auth.next')}
      </Button>
    </Wrapper48>
  )
}
