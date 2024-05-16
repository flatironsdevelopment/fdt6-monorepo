import { HomeIcon } from '@/components/icons/icons/HomeIcon'

export type NavbarItemProps = {
  name: string
  link: string
  icon: React.FC
}

export const navbarItems = [
  { name: 'Tab Name 1', link: '/dashboard/#', icon: HomeIcon },
  { name: 'Tab Name 2', link: '/dashboard/#', icon: HomeIcon },
  { name: 'Tab Name 3', link: '/dashboard/#', icon: HomeIcon }
] as NavbarItemProps[]
