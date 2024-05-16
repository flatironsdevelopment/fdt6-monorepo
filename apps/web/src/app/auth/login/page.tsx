import { LogoSection, TwoSidesLayout } from '@/components/auth/common'
import { Suspense } from 'react'
import { fetchSessionOnServerSide } from '../utils/server-utils'
import { LoginFormClientSection } from './client-section'

const Login = async () => {
  const session = await fetchSessionOnServerSide()

  if (session) {
    // return redirect('/')
  }

  return (
    <TwoSidesLayout>
      <LogoSection />
      <Suspense>
        <LoginFormClientSection />
      </Suspense>
    </TwoSidesLayout>
  )
}

export default Login
