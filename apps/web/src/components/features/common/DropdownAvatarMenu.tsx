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
  'items-center text-coolGray-900 dark:text-white text-lg font-semibold cursor-pointer'

export const Item = ({ link, Icon, text }: any) => (
  <Link href={link}>
    <Wrapper12 className={itemStyles}>
      <Icon className={itemStyles} />
      <P className={itemStyles}>{text}</P>
    </Wrapper12>
  </Link>
)

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

const DropdownItem = ({
  children,
  onClick
}: {
  onClick?: () => void
  children: React.ReactNode
}) => (
  <DropdownMenuItem
    onClick={onClick}
    className="focus:bg-coolGray-100 dark:focus:bg-coolGray-700 cursor-pointer"
  >
    {children}
  </DropdownMenuItem>
)

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
      <DropdownMenuContent
        className="w-64 bg-white dark:bg-coolGray-800"
        {...contentProps}
      >
        <DropdownMenuGroup>
          <DropdownItem>
            <AccountSettingsItem />
          </DropdownItem>

          <DropdownItem>
            <AccountManagementItem />
          </DropdownItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-coolGray-800 dark:bg-white" />

        <DropdownMenuGroup>
          <DropdownItem onClick={logout}>
            <Wrapper12 className={itemStyles}>
              <HomeIcon className={itemStyles} />
              <P className={itemStyles}>Logout</P>
            </Wrapper12>
          </DropdownItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
