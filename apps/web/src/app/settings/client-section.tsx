'use client'

import { ResetPasswordForm } from '@/components/features/settings/reset-password-form'
import { EditIcon } from '@/components/icons/icons/EditIcon'
import { Button } from '@/components/ui/button'
import { MobileHeader } from '@/components/ui/header'
import { Switch } from '@/components/ui/switch'
import { H3, P } from '@/components/ui/typography'
import { UserAvatar } from '@/components/ui/user-avatar'
import {
  Wrapper,
  Wrapper12,
  Wrapper16,
  Wrapper24,
  Wrapper32,
  Wrapper40,
  Wrapper8
} from '@/components/ui/wrapper'
import { useTranslation } from '@/i18n/useTranslation'
import { useToast } from '@fuel/ui'
import { useAuthContext } from 'api-authentication'
import { get } from 'lodash'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Links } from '../auth/utils/constants'

export type Props = {}

const Section = ({ children, ...props }: any) => {
  return (
    <Wrapper16 className="border border-bg-primary p-4" {...props}>
      {children}
    </Wrapper16>
  )
}

const AccountInformation = ({
  currentIdentifier = '',
  email,
  t
}: {
  currentIdentifier?: string
  email?: string
  t?: any
}) => {
  return (
    <>
      <h4 className="text-2xl font-bold">
        {t('settings.account_information')}
      </h4>
      <Section col>
        <Wrapper24 className="justify-between items-center">
          <Wrapper className="items-center max-lg:items-start w-full">
            <UserAvatar userName={currentIdentifier} />

            <Wrapper24 className="max-lg:flex-col justify-between w-full">
              <Wrapper8 col>
                <Wrapper12 className="max-lg:flex-col max-lg:gap-1">
                  <p className="text-lg font-bold">{currentIdentifier}</p>
                  <p className="max-lg:hidden">|</p>
                  <p>Main Account</p>
                </Wrapper12>
                <p className="text-foreground-tertiary">{email}</p>
              </Wrapper8>

              <Button
                LeftIcon={EditIcon}
                variant="link"
                className="w-fit max-lg:self-end"
              >
                {t('settings.edit')}
              </Button>
            </Wrapper24>
          </Wrapper>
        </Wrapper24>
      </Section>
    </>
  )
}

const ResetPasswordSection = ({ t }: any) => {
  const { changePassword, changePasswordState } = useAuthContext()
  const { toast } = useToast()

  const handleSubmit = useCallback(
    async ({
      oldPassword,
      password
    }: {
      oldPassword: string
      password: string
    }) => {
      try {
        await changePassword(oldPassword, password)

        toast({
          title: t('password_changed'),
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
    <ResetPasswordForm
      handleSubmit={handleSubmit}
      isLoading={changePasswordState.isLoading}
    />
  )
}

const TwoFactorSection = ({ t }: any) => {
  const { userState, disableTOTPMfa, disableSMSMfa } = useAuthContext()
  const router = useRouter()

  const has2FAEnabled = !!get(
    userState,
    'data.user.mfaConfig.preferredSetting',
    false
  )

  const toggle2FA = useCallback(
    (checked: boolean) => {
      if (checked) {
        return router.push(`${Links.TWO_FACTOR}`)
      }

      Promise.all([disableTOTPMfa(), disableSMSMfa()])
    },
    [disableSMSMfa, disableTOTPMfa, router]
  )

  return (
    <>
      <h4 className="text-2xl font-bold">
        {t('auth.two_factor_authentication')}
      </h4>
      <Section col>
        <Wrapper32 className="max-md:gap-6" center>
          <Wrapper8 col>
            <h5 className="text-lg font-bold">{t('settings.manage_2fa')}</h5>
            <p>{t('settings.enable_2fa_message')}</p>
          </Wrapper8>
          <Switch checked={has2FAEnabled} onCheckedChange={toggle2FA} />
        </Wrapper32>
      </Section>
    </>
  )
}

const Divider = () => {
  return <hr />
}

const Header = () => {
  return <MobileHeader className="md:block lg:hidden" />
}

export const Settings = () => {
  const { userState } = useAuthContext()
  const { t } = useTranslation()
  const firstName = get(userState, 'data.user.firstName', '')
  const lastName = get(userState, 'data.user.lastName', '')
  const email = get(userState, 'data.user.email')
  const currentIdentifier = `${firstName} ${lastName}`

  return (
    <>
      <Header />

      <Wrapper40 col className="p-12 max-lg:px-4 max-lg:py-8">
        <Wrapper16 col>
          <H3>{t('settings.account_settings')}</H3>
          <P>{t('settings.you_are_currently_logged_in_as', { email })}</P>
        </Wrapper16>

        <AccountInformation
          currentIdentifier={currentIdentifier}
          email={email}
          t={t}
        />
        <Divider />
        <ResetPasswordSection t={t} />
        <Divider />
        <TwoFactorSection t={t} />
      </Wrapper40>
    </>
  )
}
