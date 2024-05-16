import { HomeIcon } from '@/components/icons/icons/HomeIcon'

export const ITEMS = {
  HOME: 'HOME',
  SAMPLE: 'SAMPLE',
  OTHER: 'OTHER',
  AVATAR: 'AVATAR'
} as const

export type ITEMS_KEYS = keyof typeof ITEMS

export const centerMenuItems = [
  { name: 'Home', link: '#', icon: HomeIcon },
  { name: 'Sample', link: '#', icon: HomeIcon },
  { name: 'Other', link: '#', icon: HomeIcon }
] as const
