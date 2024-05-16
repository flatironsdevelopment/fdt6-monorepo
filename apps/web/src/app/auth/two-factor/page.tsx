import { CenteredLayout } from '@/components/auth/common'
import PhoneIcon from '@/components/icons/icons/PhoneIcon'
import SMSIcon from '@/components/icons/icons/SMSIcon'
import { Button } from '@/components/ui/button'
import { H3, P } from '@/components/ui/typography'
import { Wrapper12, Wrapper16, Wrapper48 } from '@/components/ui/wrapper'
import { ssrTranslation } from '@/i18n/ssrTranslation'
import Link from 'next/link'
import { Links } from '../utils/constants'

const TwoFactorPage = async () => {
  const { t } = await ssrTranslation()

  return (
    <CenteredLayout className="bg-white">
      <Wrapper48 columnDirection>
        <Wrapper16 columnDirection>
          <H3 className="text-center">
            {t('auth.choose_verification_method')}
          </H3>
          <P className="text-center">
            {t('auth.asked_for_a_verification_code')}
          </P>
        </Wrapper16>

        <Wrapper12 columnDirection>
          <Link href={Links.TWO_FACTOR_APP}>
            <Button LeftIcon={PhoneIcon} className="w-full">
              {t('auth.use_authentication_app')}
            </Button>
          </Link>
          <Link href={Links.TWO_FACTOR_SMS}>
            <Button LeftIcon={SMSIcon} variant="outline" className="w-full">
              {t('auth.sms_text_message')}
            </Button>
          </Link>
        </Wrapper12>
      </Wrapper48>
    </CenteredLayout>
  )
}

export default TwoFactorPage
