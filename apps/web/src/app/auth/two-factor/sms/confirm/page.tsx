import { CenteredLayout } from '@/components/auth/common'
import { ConfirmSMSCodeClientSection } from './client-section'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const SMSPage = async ({ searchParams }: Props) => {
  return (
    <CenteredLayout className="bg-white">
      <ConfirmSMSCodeClientSection />
    </CenteredLayout>
  )
}

export default SMSPage
