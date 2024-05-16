'use client'

import { OneSideSection } from '@/components/auth/common'
import CheckIcon from '@/components/icons/icons/CheckIcon'
import { Button } from '@/components/ui/button'
import { H1, P } from '@/components/ui/typography'
import { Wrapper, Wrapper16, Wrapper48 } from '@/components/ui/wrapper'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const ConfirmRecoveryCodeClientSection = () => {
  const {
    resendSignUpEmail,
    resendSignUpEmailState: { isLoading }
  } = useAuthContext()
  const { t } = useTranslation()
  const { toast } = useToast()

  const params = useSearchParams()
  const email = decodeURIComponent(params?.get('email') || '')

  const handleResendCode = useCallback(async () => {
    await resendSignUpEmail(email)

    toast({
      title: t('auth.email_sent'),
      variant: 'success'
    })
  }, [resendSignUpEmail, email, toast, t])

  return (
    <OneSideSection className="bg-white">
      <Wrapper48 columnDirection>
        <CheckIcon className="w-14 h-14 text-success" />

        <Wrapper16 columnDirection>
          <H1>{t('auth.email_sent')}</H1>
          <P>{t('auth.we_sent_you_an_email_to_set_up_your_new_password')}</P>
        </Wrapper16>

        <Wrapper className="align-center gap-1">
          <P className="uppercase font-bold">{t('auth.didnt_get_the_link')}</P>
          <Button
            variant="link"
            className="m-0 p-0 h-auto font-bold"
            onClick={handleResendCode}
            isLoading={isLoading}
          >
            {t('auth.resend')}
          </Button>
        </Wrapper>
      </Wrapper48>
    </OneSideSection>
  )
}
