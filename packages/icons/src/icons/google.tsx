import { Ref, SVGProps, forwardRef } from 'react'

import { Props } from '../types.d'

const Google = (props: SVGProps<any>, ref: Ref<any>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="google"
    ref={ref}
    {...props}
  >
    <g className="google__Clippathgroup">
      <g className="google__Clippathgroup__b">
        <path
          d="M21.3182 10.1818H12V14.0455H17.3636C16.8636 16.5 14.7727 17.9091 12 17.9091C8.72727 17.9091 6.09091 15.2727 6.09091 12C6.09091 8.72727 8.72727 6.09091 12 6.09091C13.4091 6.09091 14.6818 6.59091 15.6818 7.40909L18.5909 4.5C16.8182 2.95455 14.5455 2 12 2C6.45455 2 2 6.45455 2 12C2 17.5455 6.45455 22 12 22C17 22 21.5455 18.3636 21.5455 12C21.5455 11.4091 21.4545 10.7727 21.3182 10.1818Z"
          fill="#8E97A0"
          className="google__Clippathgroup__b__Vector"
        />
      </g>
    </g>
  </svg>
)

const ForwardRef = forwardRef<SVGSVGElement, Props>(Google)
export { ForwardRef as Google }
