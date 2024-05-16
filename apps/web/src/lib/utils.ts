import { FeatureState } from 'api-authentication'
import { clsx, type ClassValue } from 'clsx'
import { get } from 'lodash'
import { twMerge } from 'tailwind-merge'
import { User } from '~types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentIdentifier = (userState: FeatureState<User>): string => {
  if (!userState.data) return ''

  const firstName = get(userState, 'data.user.firstName', '')
  const lastName = get(userState, 'data.user.lastName', '')

  return `${firstName} ${lastName}`
}
