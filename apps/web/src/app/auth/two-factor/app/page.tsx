import { CenteredLayout } from '@/components/auth/common'
import { ConfirmAuthAppCodeClientSection } from './client-section'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const AuthAppPage = async ({ searchParams }: Props) => {
  return (
    <CenteredLayout className="bg-white">
      <ConfirmAuthAppCodeClientSection />
    </CenteredLayout>
  )
}

export default AuthAppPage
