import { CenteredLayout } from '@/components/auth/common'
import { Suspense } from 'react'
import { ChangePasswordClient } from './client-section'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

const Confirmation = async ({ searchParams }: Props) => {
  return (
    <CenteredLayout>
      <Suspense>
        <ChangePasswordClient />
      </Suspense>
    </CenteredLayout>
  )
}

export default Confirmation
