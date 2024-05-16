import { CenteredLayout } from '@/components/auth/common'
import { ConfirmLogin2FAClientSection } from './client-section'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const AuthAppPage = async ({ searchParams }: Props) => {
  return (
    <CenteredLayout className="bg-white">
      <ConfirmLogin2FAClientSection />
    </CenteredLayout>
  )
}

export default AuthAppPage
