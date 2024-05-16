import { Ref, SVGProps, forwardRef } from 'react'

import { Props } from '../types.d'

const ArrowDownLeft = (props: SVGProps<any>, ref: Ref<any>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="arrow-down-left"
    ref={ref}
    {...props}
  >
    <path
      d="M17 16H9.41L17.71 7.71C17.8983 7.52169 18.0041 7.2663 18.0041 7C18.0041 6.7337 17.8983 6.4783 17.71 6.29C17.5217 6.10169 17.2663 5.99591 17 5.99591C16.7337 5.99591 16.4783 6.10169 16.29 6.29L8 14.59V7C8 6.73478 7.89464 6.48043 7.70711 6.29289C7.51957 6.10536 7.26522 6 7 6C6.73478 6 6.48043 6.10536 6.29289 6.29289C6.10536 6.48043 6 6.73478 6 7V17C6.00158 17.1307 6.02876 17.2598 6.08 17.38C6.18147 17.6243 6.37565 17.8185 6.62 17.92C6.74022 17.9712 6.86932 17.9984 7 18H17C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.7348 17.8946 16.4804 17.7071 16.2929C17.5196 16.1054 17.2652 16 17 16Z"
      fill="currentColor"
      className="arrow-down-left__Vector"
    />
  </svg>
)

const ForwardRef = forwardRef<SVGSVGElement, Props>(ArrowDownLeft)
export { ForwardRef as ArrowDownLeft }
