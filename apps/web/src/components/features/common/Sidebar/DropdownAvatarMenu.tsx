'use client'

import { Links } from '@/app/auth/utils/constants'
import { HomeIcon } from '@/components/icons/icons/HomeIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Link, P } from '@/components/ui/typography'
import { Wrapper12 } from '@/components/ui/wrapper'

export const itemStyles =
  'items-center text-coolGray-900 dark:text-white group-hover:text-coolGray-50 text-lg font-semibold cursor-pointer'

export const AccountSettingsItem = () => (
  <Link href={Links.SETTINGS}>
    <Wrapper12 className={itemStyles}>
      <HomeIcon className={itemStyles} />
      <P className={itemStyles}>Account Settings</P>
    </Wrapper12>
  </Link>
)

export const AccountManagementItem = () => (
  <Link href={''}>
    <Wrapper12 className={itemStyles}>
      <HomeIcon className={itemStyles} />
      <P className={itemStyles}>Sub Accounts</P>
    </Wrapper12>
  </Link>
)

export const LogoutItem = () => {
  // const { logout } = useAuth()
  const logout = () => {}

  return (
    <Wrapper12 className={itemStyles} onClick={logout}>
      <HomeIcon className={itemStyles} />
      <P className={itemStyles}>Logout</P>
    </Wrapper12>
  )
}

type AvatarDropdownMenuProps = {
  children: React.ReactNode
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>
}

export function AvatarDropdownMenu({
  children,
  contentProps = {}
}: AvatarDropdownMenuProps) {
  const logout = () => {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" {...contentProps}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <AccountSettingsItem />
          </DropdownMenuItem>

          <DropdownMenuItem>
            <AccountManagementItem />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>
            <Wrapper12 className={itemStyles}>
              <HomeIcon className={itemStyles} />
              <P className={itemStyles}>Logout</P>
            </Wrapper12>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
