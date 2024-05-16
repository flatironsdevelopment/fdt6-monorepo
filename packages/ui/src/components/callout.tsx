import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn, mergeTailwindClasses } from './utils'

import {
  AngleRightSmall,
  Approve,
  Close,
  ExclamationMark,
  Info
} from '@fuel/icons'
import { get, toArray } from 'lodash'
import { Wrapper12, Wrapper4, Wrapper8 } from './wrapper'

const icons = {
  neutral: null,
  information: <Info />,
  success: <Approve />,
  warning: <ExclamationMark />,
  error: <Close />
}

const calloutVariants = cva('flex w-full rounded-lg border-2 p-5', {
  variants: {
    variant: {
      neutral:
        'bg-coolGray-50 text-coolGray-900 border-coolGray-900 [&>svg]:text-coolGray-900',
      information:
        'bg-blue-50 text-blue-900 border-blue-500 [&>svg]:text-blue-900',
      success:
        'bg-green-50 text-green-900 border-green-500 [&>svg]:text-green-900',
      warning:
        'bg-yellow-50 text-yellow-900 border-yellow-500 [&>svg]:text-yellow-900',
      error: 'border-red-900 bg-red-50 text-red-900 [&>svg]:text-red-900'
    }
  },
  defaultVariants: {
    variant: 'neutral'
  }
})

const Callout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof calloutVariants>
>(({ className, variant, ...props }, ref) => {
  const hasDescription = toArray(props.children)?.some((node) => {
    const nodeName = get(node, 'type.displayName', '')
    return nodeName === CalloutDescription.displayName
  })

  return (
    <div
      ref={ref}
      role="callout"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      <Wrapper12
        className={mergeTailwindClasses(
          'w-full',
          hasDescription && 'align-star'
        )}
      >
        {icons[variant || 'neutral']}

        <Wrapper8
          className={mergeTailwindClasses(
            'justify-between w-full',
            hasDescription && 'flex-col'
          )}
        >
          {props.children}
        </Wrapper8>
      </Wrapper12>
    </div>
  )
})
Callout.displayName = 'Callout'

const CalloutTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
))
CalloutTitle.displayName = 'CalloutTitle'

const CalloutDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-lg [&_p]:text-lg', className)}
    {...props}
  />
))
CalloutDescription.displayName = 'CalloutDescription'

const CalloutAction = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & { showAngleIcon?: boolean }
>(({ className, showAngleIcon, ...props }, ref) => (
  <Wrapper4 className="items-end">
    <a
      ref={ref}
      className={cn(
        'cursor-pointer text-action font-semibold text-lg',
        showAngleIcon && 'mt-2',
        className
      )}
      {...props}
    />
    {showAngleIcon && <AngleRightSmall />}
  </Wrapper4>
))
CalloutAction.displayName = 'CalloutAction'

export { Callout, CalloutAction, CalloutDescription, CalloutTitle }
