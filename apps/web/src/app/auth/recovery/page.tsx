import { LogoSection, TwoSidesLayout } from '@/components/auth/common'
import { Suspense } from 'react'
import { RecoveryClientSection } from './client-section'

const Recovery = () => {
  return (
    <TwoSidesLayout>
      <LogoSection />
      <Suspense>
        <RecoveryClientSection />
      </Suspense>
    </TwoSidesLayout>
  )
}

export default Recovery
