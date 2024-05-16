import * as React from 'react'
import { IconProps } from '../types'

export const CheckIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
        ref={forwardedRef}
      >
        <path
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.68 7.29a.997.997 0 0 0-.708-.29 1.012 1.012 0 0 0-.707.29l-7.422 7.298-3.118-3.072a1.02 1.02 0 0 0-.725-.28 1.035 1.035 0 0 0-.714.304.998.998 0 0 0-.286.712.984.984 0 0 0 .31.702l3.826 3.757a.998.998 0 0 0 .707.289 1.013 1.013 0 0 0 .708-.29l8.128-7.982a.98.98 0 0 0 .321-.72.963.963 0 0 0-.32-.719Z"
        />
      </svg>
    )
  }
)
CheckIcon.displayName = 'CheckIcon'
export default CheckIcon
