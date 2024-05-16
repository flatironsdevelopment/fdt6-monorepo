'use client'

import { H1 } from '@/components/ui/typography'
import Link from 'next/link'
import { Links } from './utils/constants'

export function LinksComponent() {
  return (
    <div className="mx-auto my-4 flex w-fit flex-col gap-4">
      <H1>Auth Routes:</H1>
      <Link className="text-blue-500" href={Links.LOGIN}>
        Login
      </Link>

      <Link className="text-blue-500" href={Links.LOGIN_2FA}>
        Login 2FA confirmation
      </Link>

      <Link className="text-blue-500" href={Links.REGISTER}>
        Register an account
      </Link>

      <Link className="text-blue-500" href={Links.FORGOT_PASSWORD}>
        Forgot Password
      </Link>

      <Link className="text-blue-500" href={Links.FORGOT_PASSWORD_CONFIRMATION}>
        Forgot Password Confirmation
      </Link>

      <Link className="text-blue-500" href={Links.CHANGE_PASSWORD}>
        Change password
      </Link>

      <Link className="text-blue-500" href={Links.TWO_FACTOR}>
        Two Factor activation
      </Link>

      <Link className="text-blue-500" href={Links.SUCCESS_TWO_FACTOR_APP}>
        Two Factor Success
      </Link>

      <H1>Other Routes:</H1>
      <Link className="text-blue-500" href={Links.SETTINGS}>
        Settings
      </Link>
      <Link className="text-blue-500" href={Links.DASHBOARD}>
        Dashboard
      </Link>
    </div>
  )
}
