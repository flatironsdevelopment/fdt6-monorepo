import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
