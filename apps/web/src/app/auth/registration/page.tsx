import { LogoSection, TwoSidesLayout } from '@/components/auth/common'
import { Suspense } from 'react'
import { fetchSessionOnServerSide } from '../utils/server-utils'
import { RegistrationClientSection } from './client-section'

const Registration = async () => {
  const session = await fetchSessionOnServerSide()

  // if (session) {
  //   return redirect('/')
  // }

  return (
    <TwoSidesLayout>
      <LogoSection />
      <Suspense>
        <RegistrationClientSection />
      </Suspense>
    </TwoSidesLayout>
  )
}

export default Registration
