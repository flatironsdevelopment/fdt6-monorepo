import { Links } from '@/app/auth/utils/constants'
import { CenteredLayout } from '@/components/auth/common'
import ShieldIcon from '@/components/icons/icons/Shield'
import { Button } from '@/components/ui/button'
import { H3, P } from '@/components/ui/typography'
import { Wrapper16, Wrapper48 } from '@/components/ui/wrapper'
import { ssrTranslation } from '@/i18n/ssrTranslation'
import Link from 'next/link'

export const SuccessTwoFactor = async () => {
  const { t } = await ssrTranslation()

  return (
    <CenteredLayout className="bg-white">
      <Wrapper48 col className="max-w-[592px]">
        <Wrapper16 col center>
          <div className="bg-success h-16 w-16 rounded-full flex items-center justify-center">
            <ShieldIcon color="white" />
          </div>

          <H3 className="text-center">
            {t('auth.two_factor_authentication_verified')}
          </H3>
          <P>{t('auth.your_account_has_been_verified')}</P>
        </Wrapper16>

        <Link href={Links.HOME}>
          <Button className="w-full">{t('auth.go_to_dashboard')}</Button>
        </Link>
      </Wrapper48>
    </CenteredLayout>
  )
}
