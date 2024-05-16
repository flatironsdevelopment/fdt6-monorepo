'use client'

import { Wrapper16 } from '@/components/ui/wrapper'
import { useAuthContext } from 'api-authentication'
import { get } from 'lodash'
import * as React from 'react'
import { Button } from '../ui/button'
import { P } from '../ui/typography'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const AuthInfo = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { userState, signOut } = useAuthContext()
    const email = get(userState, 'data.user.email')

    return (
      <Wrapper16 col className="max-w-lg">
        <P>Logged info:</P>

        <P className="break-all">
          {JSON.stringify(userState?.data || {}, null, 2)}
        </P>

        {email && (
          <Button variant="destructive" onClick={signOut}>
            Sign Out
          </Button>
        )}
      </Wrapper16>
    )
  }
)
AuthInfo.displayName = 'AuthInfo'

export { AuthInfo }
