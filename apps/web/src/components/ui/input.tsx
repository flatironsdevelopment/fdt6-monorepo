'use client'

import * as React from 'react'

import { EyesClosed, EyesOpened } from '@/components/icons'
import { mergeTailwindClasses } from '@/utils'
import { get } from 'lodash'
import { FieldError } from 'react-hook-form'
import { PasswordValidatorChecker } from '../auth/password-checker'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
  ref?: any
  icon?: any
  hideChecker?: Boolean
}

const inputStyles =
  'transition-all border-input ring-offset-background placeholder:text-tertiary focus-visible:ring-ring relative flex h-10 w-full border bg-transparent text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-coolGray-900 disabled:cursor-not-allowed disabled:opacity-50'
const iconStyles = 'fill-coolGray-500 group-disabled:fill-coolGray-300'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon: Icon, ...props }, ref) => {
    return (
      <div className={mergeTailwindClasses(inputStyles, 'border-0')}>
        <input
          ref={ref}
          type={type}
          className={mergeTailwindClasses(
            inputStyles,
            'p-4',
            error && 'border-destructive focus:ring-destructive',
            !error && 'border-input placeholder:text-tertiary bg-transparent',
            className
          )}
          {...props}
        />
        {Icon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 cursor-default"
            tabIndex={-1}
          >
            <Icon className={iconStyles} />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, hideChecker = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [typedPassword, setTypedPassword] = React.useState('')

    const [focused, setIsFocused] = React.useState(false)

    const eyesClosed = <EyesClosed className={iconStyles} />
    const eyesOpened = <EyesOpened className={iconStyles} />

    return (
      <>
        <div
          className={inputStyles}
          onChange={(e) => setTypedPassword(get(e, 'target.value', ''))}
          onFocus={(e) => setIsFocused(true)}
          onBlur={(e) => setIsFocused(false)}
        >
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            data-focused={focused}
            className={mergeTailwindClasses(
              inputStyles,
              'p-4',
              error && 'border-destructive focus:ring-destructive',
              !error && 'border-input placeholder:text-tertiary bg-transparent',
              className
            )}
            {...props}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? eyesClosed : eyesOpened}
          </button>
        </div>

        <PasswordValidatorChecker
          password={typedPassword}
          visible={focused && !hideChecker}
        />
      </>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { Input, PasswordInput }
