'use client'

import { mergeTailwindClasses } from '@/utils'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '../ui/button'
import { Logo } from '../ui/logo'
import { ScrollArea } from '../ui/scroll-area'

type Props = {
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const SectionWithTwoSidesBackground = ({ children }: Props) => (
  <section className="bg-background-contrast h-full">{children}</section>
)

export const SectionWithCenterBackground = ({ children, className }: Props) => (
  <section
    className={mergeTailwindClasses('bg-background-contrast h-full', className)}
  >
    {children}
  </section>
)

export const DashboardLayout = ({ children }: Props) => (
  <div className="h-full">{children}</div>
)

export const TwoSidesLayout = ({ children }: Props) => (
  <SectionWithTwoSidesBackground>
    <div className="h-full md:flex md:flex-row">{children}</div>
  </SectionWithTwoSidesBackground>
)

export const CenteredLayout = ({ children, className }: Props) => (
  <SectionWithCenterBackground className={className}>
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  </SectionWithCenterBackground>
)

export const CenterSection = ({ className, children }: Props) => (
  <section
    className={mergeTailwindClasses(
      'px-12 py-10 bg-background rounded-xl justify-center max-md:w-full max-md:rounded-none max-md:h-full max-md:px-4 max-md:py-8',
      className
    )}
  >
    <div
      className={mergeTailwindClasses(
        'w-full md:max-w-lg md:min-w-[500px]',
        className
      )}
    >
      {children}
    </div>
  </section>
)

export const SectionWrapper = ({ className, children }: Props) => (
  <div
    className={mergeTailwindClasses(
      'max-md:px-4 max-md:my-8 w-full max-lg:px-12 lg:max-w-md',
      className
    )}
  >
    {children}
  </div>
)

export const OneSideSection = ({ className, children }: Props) => (
  <section
    className={mergeTailwindClasses(
      'flex flex-col md:items-center md:justify-center sm:w-full h-full md:w-6/12',
      className
    )}
  >
    <SectionWrapper>{children}</SectionWrapper>
  </section>
)

export const OneSideScrollSection = ({ className, children }: Props) => (
  <ScrollArea className="bg-background sm:w-full md:h-full md:w-6/12">
    <div className="flex flex-col items-center justify-center py-20 max-md:py-8">
      <div className="max-md:w-full px-4">{children}</div>
    </div>
  </ScrollArea>
)

export const FormHeader = ({ className, children }: Props) => (
  <header
    className={mergeTailwindClasses('mb-12 flex flex-col gap-4', className)}
  >
    {children}
  </header>
)

export const LogoSection = () => {
  return (
    <div className="flex flex-col justify-center sm:w-full md:px-12 md:h-full md:w-6/12 xl:px-24 2xl:px-28 relative">
      <div className="max-md:px-4 max-md:my-6 my-16 flex h-full w-full flex-col justify-between gap-4">
        <Logo href="/" />
        <div className="max-md:hidden grid content-center h-full">
          <h1 className="inline text-7xl max-sm:text-6xl md:block max-md:text-6xl font-semibold text-background">
            Lorem Ipsum
          </h1>
        </div>
      </div>
    </div>
  )
}

export const FieldSet = ({ className, children }: Props) => (
  <fieldset className={mergeTailwindClasses('flex flex-col gap-6', className)}>
    {children}
  </fieldset>
)

type SubmitButtonProps = {
  form: UseFormReturn<any>
  isLoading?: boolean
} & Props
export const SubmitButton = ({
  className,
  children,
  form,
  isLoading
}: SubmitButtonProps) => (
  <Button
    className={mergeTailwindClasses('mb-8 mt-12 w-full max-w-full', className)}
    disabled={!form?.formState.isValid || isLoading}
    isLoading={isLoading}
    type="submit"
  >
    {children}
  </Button>
)
