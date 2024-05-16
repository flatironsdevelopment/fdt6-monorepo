'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { useAuthContext } from 'api-authentication'

export const Logout = ({ ...props }: ButtonProps) => {
  const { signOut } = useAuthContext()

  return (
    <Button isLoading={false} className="w-full" onClick={signOut} {...props}>
      {props.children || 'Logout'}
    </Button>
  )
}
