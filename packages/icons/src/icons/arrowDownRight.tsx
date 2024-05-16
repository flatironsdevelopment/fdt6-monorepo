import { Ref, SVGProps, forwardRef } from 'react'

import { Props } from '../types.d'

const ArrowDownRight = (props: SVGProps<any>, ref: Ref<any>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="arrow-down-right"
    ref={ref}
    {...props}
  >
    <path
      d="M17 6C16.7348 6 16.4804 6.10536 16.2929 6.2929C16.1054 6.48043 16 6.73479 16 7V14.59L7.71 6.29C7.5217 6.1017 7.2663 5.99591 7 5.99591C6.7337 5.99591 6.47831 6.1017 6.29 6.29C6.1017 6.47831 5.99591 6.7337 5.99591 7C5.99591 7.2663 6.1017 7.5217 6.29 7.71L14.59 16H7C6.73479 16 6.48043 16.1054 6.2929 16.2929C6.10536 16.4804 6 16.7348 6 17C6 17.2652 6.10536 17.5196 6.2929 17.7071C6.48043 17.8946 6.73479 18 7 18H17C17.1307 17.9984 17.2598 17.9712 17.38 17.92C17.6244 17.8185 17.8185 17.6244 17.92 17.38C17.9712 17.2598 17.9984 17.1307 18 17V7C18 6.73479 17.8946 6.48043 17.7071 6.2929C17.5196 6.10536 17.2652 6 17 6Z"
      fill="currentColor"
      className="arrow-down-right__Vector"
    />
  </svg>
)

const ForwardRef = forwardRef<SVGSVGElement, Props>(ArrowDownRight)
export { ForwardRef as ArrowDownRight }
