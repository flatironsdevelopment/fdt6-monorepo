import { LogoSection, TwoSidesLayout } from '@/components/auth/common'
import { Suspense } from 'react'
import { ConfirmRecoveryCodeClientSection } from './client-section'

const ConfirmRecoveryCode = () => {
  return (
    <TwoSidesLayout>
      <LogoSection />
      <Suspense>
        <ConfirmRecoveryCodeClientSection />
      </Suspense>
    </TwoSidesLayout>
  )
}

export default ConfirmRecoveryCode
