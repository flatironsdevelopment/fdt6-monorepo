import { MenuHamburgerIcon } from '@/components/icons/icons/MenuHamburgerIcon'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/ui/logo'
import { getCurrentIdentifier } from '@/lib/utils'
import { useAuthContext } from 'api-authentication'
import {
  AccountManagementItem,
  AccountSettingsItem,
  Item,
  LogoutItem
} from './DropdownAvatarMenu'
import { AvatarItem } from './Sidebar/Sidebar'
import { centerMenuItems } from './Sidebar/constants'

type ModalProps = {
  children: React.ReactNode
}

export const MobileNavigationMenu = ({ children }: ModalProps) => {
  const ItemWrapper = ({ children }: any) => (
    <div className="p-4">{children}</div>
  )
  const { userState } = useAuthContext()
  const currentIdentifier = getCurrentIdentifier(userState) || 'John Smith'

  return (
    <Dialog data-testid="edit-subaccount-modal">
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        fullScreen
        hideCloseButton
        className="py-[22px] px-12 bg-white dark:bg-coolGray-800"
      >
        <section>
          <DialogHeader className="flex flex-row items-center justify-between mb-4">
            <Logo />
            <DialogClose className="h-6 w-6 text-coolGray-900 dark:text-white !mt-0">
              <MenuHamburgerIcon />
            </DialogClose>
          </DialogHeader>

          <DialogDescription>
            {centerMenuItems.map(({ icon, link, name }) => (
              <ItemWrapper key={name}>
                <Item Icon={icon} text={name} link={link} />
              </ItemWrapper>
            ))}

            <DropdownMenuSeparator className="my-7 bg-coolGray-800 dark:bg-white" />

            <AvatarItem
              expanded
              mobileMenu
              userName={currentIdentifier}
              className="mb-4"
            />

            <ItemWrapper>
              <AccountSettingsItem />
            </ItemWrapper>
            <ItemWrapper>
              <AccountManagementItem />
            </ItemWrapper>

            <DropdownMenuSeparator className="bg-coolGray-800 dark:bg-white" />

            <ItemWrapper>
              <LogoutItem />
            </ItemWrapper>
          </DialogDescription>
        </section>
      </DialogContent>
    </Dialog>
  )
}
