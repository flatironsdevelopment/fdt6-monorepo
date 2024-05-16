import { Ref, SVGProps, forwardRef } from 'react'

import { Props } from '../types.d'

const AngleLeftBig = (props: SVGProps<any>, ref: Ref<any>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="angle-left-big"
    ref={ref}
    {...props}
  >
    <path
      d="M8.49115 12.7642L14.1511 18.4142C14.2441 18.5079 14.3547 18.5823 14.4766 18.6331C14.5984 18.6839 14.7291 18.71 14.8611 18.71C14.9932 18.71 15.1239 18.6839 15.2457 18.6331C15.3676 18.5823 15.4782 18.5079 15.5711 18.4142C15.7574 18.2268 15.8619 17.9734 15.8619 17.7092C15.8619 17.445 15.7574 17.1916 15.5711 17.0042L10.6211 12.0042L15.5711 7.05421C15.7574 6.86685 15.8619 6.61339 15.8619 6.34921C15.8619 6.08502 15.7574 5.83157 15.5711 5.64421C15.4785 5.54972 15.3681 5.47455 15.2462 5.42305C15.1243 5.37156 14.9935 5.34476 14.8611 5.34421C14.7288 5.34476 14.598 5.37156 14.4761 5.42305C14.3542 5.47455 14.2438 5.54972 14.1511 5.64421L8.49115 11.2942C8.38964 11.3879 8.30863 11.5015 8.25323 11.628C8.19782 11.7545 8.16921 11.8911 8.16921 12.0292C8.16921 12.1673 8.19782 12.3039 8.25323 12.4304C8.30863 12.5569 8.38964 12.6706 8.49115 12.7642Z"
      fill="currentColor"
      className="angle-left-big__Vector"
    />
  </svg>
)

const ForwardRef = forwardRef<SVGSVGElement, Props>(AngleLeftBig)
export { ForwardRef as AngleLeftBig }
