import * as React from 'react'

export interface Props extends React.SVGAttributes<SVGElement> {
  children?: never
  color?: string
  className?: string
}

// the group property is resposible to get the disabled state from the parent component
// this is specially useful for the buttons
// docs: https://tailwindcss.com/docs/hover-focus-and-other-states
export const DEFAULT_STYLES =
  'text-coolGray-900 group-disabled:text-coolGray-600 group-hover:text-coolGray-900 h-7 w-7 shrink-0'
