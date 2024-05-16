import { CenteredLayout } from '@/components/auth/common'
import { SendSMSClientSection } from './client-section'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const SMSPage = async ({ searchParams }: Props) => {
  return (
    <CenteredLayout className="bg-white">
      <SendSMSClientSection />
    </CenteredLayout>
  )
}

export default SMSPage
