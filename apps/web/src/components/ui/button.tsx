import { LoadingSpinner } from '@/components/icons'
import { mergeTailwindClasses, styled } from '@/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { ButtonHTMLAttributes, FC, forwardRef } from 'react'

const iconVariants = cva('group-disabled:fill-coolGray-600 fill-white', {
  variants: {
    variant: {
      primary: 'text-foreground-button group-hover:text-foreground-button',
      outline: 'bg-white',
      subtle: 'bg-action-focus group-hover:bg-action-focus',
      ghost: 'bg-action-focus group-hover:bg-action-focus',
      link: 'group-hover:bg-transparent',
      destructive: 'text-foreground-button group-hover:text-foreground-button',
      icon: ''
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})

const defaultStyles = styled(
  'bg-coolGray-900 focus-visible:ring-ring group flex items-center justify-center gap-4 text-lg transition-colors focus:ring-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed'
)

const buttonVariants = cva(defaultStyles, {
  variants: {
    variant: {
      primary:
        'text-foreground-button disabled:bg-action-disabled disabled:text-coolGray-600 bg-action hover:bg-action-hover',
      outline:
        'bg-white border-coolGray-700 active:border-bg-action-focus disabled:text-coolGray-600 border-2 border-solid hover:border-bg-action-focus focus:outline-none disabled:border-none',
      subtle:
        'hover:bg-coolGray-700 active:border-coolGray-700 disabled:text-foreground-btndisabled hover:border-bg-action-focus focus:outline-none disabled:border-none',
      ghost:
        'hover:bg-coolGray-800 active:border-coolGray-700 disabled:text-coolGray-600 hover:border-bg-action-focus focus:outline-none disabled:border-none',
      link: 'disabled:text-coolGray-600 bg-transparent hover:underline focus:outline-none disabled:hover:no-underline gap-1',
      destructive:
        'text-foreground-button disabled:bg-action-disabled disabled:text-coolGray-600 bg-error hover:bg-error-secondary',
      icon: 'hover:bg-coolGray-800 active:border-coolGray-700 disabled:text-coolGray-600 bg-transparent hover:border-bg-action-focus focus:outline-none disabled:border-none'
    },
    size: {
      large: 'h-14 px-6',
      medium: 'h-12 px-5',
      small: 'h-10 px-4',
      link: 'h-auto m-0 p-0'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'large'
  }
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  text?: string
  LeftIcon?: FC<any>
  RightIcon?: FC<any>
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      LeftIcon,
      RightIcon,
      className,
      variant,
      size: sizeParam,
      isLoading,
      ...props
    },
    ref
  ) => {
    const size = sizeParam ? sizeParam : variant === 'link' ? 'link' : 'large'

    const buttonStyles = mergeTailwindClasses(
      buttonVariants({ variant, size }),
      className
    )
    const iconStyles = mergeTailwindClasses(iconVariants({ variant }))

    return (
      <button
        className={buttonStyles}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {LeftIcon && <LeftIcon className={iconStyles} />}
        {children}
        {RightIcon && <RightIcon className={iconStyles} />}
      </button>
    )
  }
)
Button.displayName = 'Button'

const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        className={mergeTailwindClasses(
          'bg-background border-coolGray-800 flex h-7 w-7 cursor-pointer items-center rounded-sm border',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ActionButton.displayName = 'ActionButton'

export { ActionButton, Button, buttonVariants }
