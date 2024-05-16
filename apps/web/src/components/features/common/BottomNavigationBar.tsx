import { Logo } from '@/components/ui/logo'
import {
  NavigationMenu,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { P } from '@/components/ui/typography'
import { Wrapper8 } from '@/components/ui/wrapper'
import { MenuItem, itemStyles } from './Sidebar'
import { centerMenuItems } from './Sidebar/constants'

type BottomNavigationBarProps = {
  children: React.ReactNode
}

const BottomNavigationBar = ({ children }: BottomNavigationBarProps) => {
  return (
    <>
      <header className="py-6 px-12 bg-white dark:bg-coolGray-800 border-b">
        <Logo />
      </header>
      {children}
      <NavigationMenu className="sticky bottom-0 px-12 py-6 bg-white dark:bg-coolGray-800 w-full max-w-full">
        <NavigationMenuList>
          {centerMenuItems.map(({ icon: Icon, name, link }) => {
            const isSelected = name === centerMenuItems[0].name

            return (
              <MenuItem
                link={link}
                key={name}
                id={name}
                isSelected={isSelected}
              >
                <Wrapper8 className="w-20 flex flex-col items-center">
                  <Icon className={itemStyles({ isSelected })} />
                  <P className={itemStyles({ isSelected })}>{name}</P>
                </Wrapper8>
              </MenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default BottomNavigationBar
