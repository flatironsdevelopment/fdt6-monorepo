'use client'

import { MenuIcon } from '@/components/icons/icons/MenuIcon'
import { Logo, RetractedLogo } from '@/components/ui/logo'
import { Link, P } from '@/components/ui/typography'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Wrapper, Wrapper4, Wrapper8 } from '@/components/ui/wrapper'
import { useGeneralData } from '@/context/GeneralDataContextProvider'
import { getCurrentIdentifier } from '@/lib/utils'
import { mergeTailwindClasses } from '@/utils'
import { useAuthContext } from 'api-authentication'
import { upperCase } from 'lodash'
import { AvatarDropdownMenu } from '../DropdownAvatarMenu'
import { ITEMS_KEYS, centerMenuItems } from './constants'

export type SidebarProps = {
  testId?: string
  hideLogo?: boolean
  className?: string
  hideOnRender?: boolean
  selected: ITEMS_KEYS
  expanded?: boolean
}

export const itemStyles = ({
  isSelected,
  expanded
}: {
  isSelected: boolean
  expanded?: boolean
}) =>
  mergeTailwindClasses(
    'group-hover:text-coolGray-900 dark:group-hover:text-coolGray-50 text-xs font-semibold text-coolGray-900 dark:text-white text-center',
    isSelected && '',
    expanded && 'text-base'
  )

export const MenuItem = ({
  className,
  children,
  isSelected,
  link = '/auth/settings',
  onClick,
  id = ''
}: any) => (
  <li key={id}>
    <Link
      href={link}
      onClick={onClick}
      className={mergeTailwindClasses(
        'group flex flex-col items-center justify-center px-1 py-3 text-sm font-semibold hover:bg-coolGray-100 dark:hover:bg-coolGray-700 rounded-lg cursor-pointer',
        isSelected && 'bg-coolGray-100 dark:bg-coolGray-700',
        className
      )}
    >
      {children}
    </Link>
  </li>
)

type AvatarMenuItemProps = {
  userName: string
  className?: string
  isSelected?: boolean
  expanded?: boolean
  mobileMenu?: boolean
}

export const AvatarItem = ({
  userName,
  expanded,
  className,
  mobileMenu = false
}: AvatarMenuItemProps) => (
  <Wrapper
    className={mergeTailwindClasses(
      'items-center max-lg:max-w-[90vw] ',
      className,
      expanded && 'w-full'
    )}
  >
    <Wrapper8
      className={mergeTailwindClasses(
        'items-center justify-center text-coolGray-900 dark:text-white',
        expanded && 'w-full justify-start'
      )}
    >
      <UserAvatar userName={userName} />
      {expanded && (
        <Wrapper4 columnDirection>
          <h3 className=" font-bold">{userName}</h3>
          <p className=" text-xs">Admin</p>
        </Wrapper4>
      )}
      {!mobileMenu && (
        <MenuIcon className={mergeTailwindClasses(expanded && 'ml-auto')} />
      )}
    </Wrapper8>
  </Wrapper>
)

const AvatarMenuItem = ({ userName, expanded }: AvatarMenuItemProps) => {
  return (
    <AvatarDropdownMenu>
      <div>
        <MenuItem
          key={userName}
          link="#"
          className=" hover:bg-coolGray-50 dark:hover:hover:bg-coolGray-800 w-full"
        >
          <Wrapper className="w-full items-center justify-center ">
            <AvatarItem expanded={expanded} userName={userName} />
          </Wrapper>
        </MenuItem>
      </div>
    </AvatarDropdownMenu>
  )
}

export const Menu = ({ children }: any) => (
  <nav className="mt-10 flex flex-1 flex-col justify-between">{children}</nav>
)

export const Sidebar = ({
  selected,
  className,
  hideLogo,
  testId = 'sidebar-id',
  hideOnRender,
  expanded = false,
  ...props
}: SidebarProps) => {
  const { sidebarClosed } = useGeneralData()
  const { userState } = useAuthContext()
  const currentIdentifier = getCurrentIdentifier(userState) || 'John Smith'

  const AvatarSection = () => (
    <AvatarMenuItem
      userName={currentIdentifier}
      isSelected={false}
      expanded={expanded}
    />
  )

  const MenuSection = () => (
    <Menu>
      <Wrapper className="h-full justify-between" columnDirection>
        <ul role="list" className="space-y-4">
          {centerMenuItems.map(({ icon: Icon, name, link }) => {
            const isSelected = upperCase(selected) === upperCase(name)
            return (
              <MenuItem
                link={link}
                isSelected={isSelected}
                key={name}
                id={name}
              >
                <Wrapper8
                  className={mergeTailwindClasses(
                    'w-20 flex flex-col items-center',
                    expanded && 'flex-row w-full'
                  )}
                >
                  <Icon className={itemStyles({ isSelected })} />
                  <P className={itemStyles({ isSelected, expanded })}>{name}</P>
                </Wrapper8>
              </MenuItem>
            )
          })}
        </ul>
      </Wrapper>
      <ul role="list">
        <AvatarSection />
      </ul>
    </Menu>
  )

  const DesktopSideBar = () => (
    <aside
      className={mergeTailwindClasses(
        'lg:w-28 bg-background-contrast bg-white dark:bg-coolGray-800 ease relative hidden border-r px-3 py-6 transition-all duration-300 lg:flex lg:flex-col',
        className,
        expanded && 'lg:w-72 shrink-0 p-6',
        sidebarClosed && hideOnRender && 'lg:hidden'
      )}
      data-testid={testId}
      {...props}
    >
      {!hideLogo && (
        <Wrapper
          className={mergeTailwindClasses(
            'justify-center',
            expanded && 'justify-start'
          )}
        >
          {expanded ? <Logo className="w-51 h-auto" /> : <RetractedLogo />}
        </Wrapper>
      )}
      <MenuSection />
    </aside>
  )

  return <DesktopSideBar />
}
