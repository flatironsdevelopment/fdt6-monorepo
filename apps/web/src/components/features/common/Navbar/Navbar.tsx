import { MenuHamburgerIcon } from '@/components/icons/icons/MenuHamburgerIcon'
import { MenuIcon } from '@/components/icons/icons/MenuIcon'
import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/ui/logo'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Wrapper20, Wrapper8 } from '@/components/ui/wrapper'
import { AvatarDropdownMenu } from '../DropdownAvatarMenu'
import { MobileNavigationMenu } from '../MobileNavigationMenu'
import { NavbarItemProps, navbarItems } from './constants'

export const menuContentProps = {
  align: 'end',
  sideOffset: 24
} as React.ComponentProps<typeof DropdownMenuContent>

const NavbarItem = ({ name, link, icon: Icon }: NavbarItemProps) => (
  <li className="flex">
    <a
      href={link}
      className="flex items-center justify-center text-coolGray-900 dark:text-white gap-2 font-bold min-w-max"
    >
      <Icon />
      <span className="leading-6">{name}</span>
    </a>
  </li>
)

const Navbar = ({ userName }: { userName: string }) => {
  return (
    <nav className="h-fit w-full bg-white dark:bg-coolGray-800 border-b">
      <ul className="flex flex-wrap py-[22px] lg:py-3 px-12 max-w-screen-2xl mx-auto">
        <li className="flex items-center mr-0 lg:mr-20">
          <Logo className="h-fit" />
        </li>
        <Wrapper20 className="hidden lg:flex">
          {navbarItems.map((item) => (
            <NavbarItem key={item.name} {...item} />
          ))}
        </Wrapper20>
        <li className="hidden lg:flex gap-2 ml-auto">
          <div className="flex flex-col justify-center">
            <h3 className="text-coolGray-900 dark:text-white font-bold">
              {userName}
            </h3>
            <p className="text-coolGray-900 dark:text-white text-xs">Admin</p>
          </div>
          <Wrapper8 center>
            <UserAvatar userName={userName} />
            <AvatarDropdownMenu contentProps={menuContentProps}>
              <MenuIcon
                className="text-coolGray-700 dark:text-white cursor-pointer"
                data-align="end"
              />
            </AvatarDropdownMenu>
          </Wrapper8>
        </li>
        <li className="flex lg:hidden ml-auto">
          <MobileNavigationMenu>
            <MenuHamburgerIcon className="text-coolGray-700 dark:text-white cursor-pointer" />
          </MobileNavigationMenu>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
