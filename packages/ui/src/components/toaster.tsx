'use client'

import { Approve, Close, ExclamationMark, Info } from '@fuel/icons'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast'
import { useToast } from './use-toast'

const icons = {
  neutral: null,
  information: <Info />,
  success: <Approve />,
  warning: <ExclamationMark />,
  error: <Close />
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        icon: Icon,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            {icons[props.variant || 'neutral']}
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastAction altText="action"> {action}</ToastAction>
            |
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
