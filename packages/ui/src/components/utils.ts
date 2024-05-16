import { FeatureState } from 'api-authentication'
import { clsx, type ClassValue } from 'clsx'
import { get } from 'lodash'
import { twMerge } from 'tailwind-merge'
import { User } from '~types'

export const getCurrentIdentifier = (userState: FeatureState<User>): string => {
  if (!userState.data) return ''

  const firstName = get(userState, 'data.user.firstName', '')
  const lastName = get(userState, 'data.user.lastName', '')

  return `${firstName} ${lastName}`
}

export function mergeTailwindClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cn = mergeTailwindClasses

/**
 * This is a dummy function to make a simple string be formated
 * with prettier to make tailwind styles order consistent
 *
 * @param inputs  string
 * @returns the inputed param
 */
export const styled = (inputs: string) => inputs
