import { Ref, SVGProps, forwardRef } from 'react'

import { Props } from '../types.d'

const AngleDownSmall = (props: SVGProps<any>, ref: Ref<any>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="angle-down-small"
    ref={ref}
    {...props}
  >
    <path
      d="M17 9.17C16.8126 8.98375 16.5592 8.87921 16.295 8.87921C16.0308 8.87921 15.7774 8.98375 15.59 9.17L12 12.71L8.46001 9.17C8.27265 8.98375 8.0192 8.87921 7.75501 8.87921C7.49082 8.87921 7.23737 8.98375 7.05001 9.17C6.95628 9.26296 6.88189 9.37356 6.83112 9.49542C6.78035 9.61728 6.75421 9.74799 6.75421 9.88C6.75421 10.012 6.78035 10.1427 6.83112 10.2646C6.88189 10.3864 6.95628 10.497 7.05001 10.59L11.29 14.83C11.383 14.9237 11.4936 14.9981 11.6154 15.0489C11.7373 15.0997 11.868 15.1258 12 15.1258C12.132 15.1258 12.2627 15.0997 12.3846 15.0489C12.5064 14.9981 12.617 14.9237 12.71 14.83L17 10.59C17.0937 10.497 17.1681 10.3864 17.2189 10.2646C17.2697 10.1427 17.2958 10.012 17.2958 9.88C17.2958 9.74799 17.2697 9.61728 17.2189 9.49542C17.1681 9.37356 17.0937 9.26296 17 9.17Z"
      fill="currentColor"
      className="angle-down-small__Vector"
    />
  </svg>
)

const ForwardRef = forwardRef<SVGSVGElement, Props>(AngleDownSmall)
export { ForwardRef as AngleDownSmall }
