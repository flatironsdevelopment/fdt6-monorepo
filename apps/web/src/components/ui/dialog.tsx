'use client'

import { cn } from '@/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { EyeClosedIcon } from '@radix-ui/react-icons'
import * as React from 'react'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

export type DialogProps = {
  testId?: string
}
const DialogPortal = ({
  children,
  testId = 'dialog-id',
  ...props
}: DialogPrimitive.DialogPortalProps & DialogProps) => (
  <DialogPrimitive.Portal {...props}>
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:items-center"
      data-testid={testId}
    >
      {children}
    </div>
  </DialogPrimitive.Portal>
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-50 backdrop-blur-sm backdrop-brightness-50 transition-all duration-100',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

type DialogContentProps = {
  hideCloseButton?: boolean
  fullScreen?: boolean
  closeIconStyles?: string
} & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      closeIconStyles,
      hideCloseButton,
      fullScreen,
      children,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'bg-background animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed z-50 grid w-full gap-4 overflow-auto px-6 py-12 text-left shadow-lg max-sm:h-full sm:max-w-2xl lg:max-h-[--modal-height] lg:px-16 lg:py-12',
          fullScreen &&
            'h-screen max-h-none min-w-full max-w-none lg:max-h-full',
          className
        )}
        {...props}
      >
        {children}

        {!hideCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none',
              closeIconStyles
            )}
          >
            <EyeClosedIcon className="text-gray-500" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-coolGray-50 mb-[10px] text-3xl font-semibold lg:text-4xl',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-left', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
}
