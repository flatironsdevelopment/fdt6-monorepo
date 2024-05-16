import { mergeTailwindClasses } from '@/utils'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

type Props = {
  className?: string
  ref?: React.Ref<any>
} & React.HTMLAttributes<HTMLParagraphElement>

const PARAGRAPH_BASE_STYLES = 'font-sans text-foreground'
const HEADING_BASE_STYLES = 'font-sans text-foreground'

export const P = ({ className, ...props }: Props) => {
  return (
    <p
      className={mergeTailwindClasses(PARAGRAPH_BASE_STYLES, className)}
      {...props}
    />
  )
}

export const Span = ({ className, ...props }: Props) => {
  return (
    <span
      className={mergeTailwindClasses(PARAGRAPH_BASE_STYLES, className)}
      {...props}
    />
  )
}

type LinkProps = {
  className?: string
  children?: React.ReactNode
} & NextLinkProps
export const Link = ({ className, ...props }: LinkProps) => {
  return (
    <NextLink
      className={mergeTailwindClasses(
        'text-foreground font-semibold',
        className
      )}
      {...props}
    />
  )
}

export const H1 = ({ className, ...props }: Props) => {
  return (
    <h1
      className={mergeTailwindClasses(
        HEADING_BASE_STYLES,
        'text-7xl font-bold',
        className
      )}
      {...props}
    />
  )
}

export const H2 = ({ className, ...props }: Props) => {
  return (
    <h2
      className={mergeTailwindClasses(
        HEADING_BASE_STYLES,
        'text-6xl font-bold',
        className
      )}
      {...props}
    />
  )
}

export const H3 = ({ className, ...props }: Props) => {
  return (
    <h2
      className={mergeTailwindClasses(
        HEADING_BASE_STYLES,
        'max-lg:text-3xl text-5xl font-bold',
        className
      )}
      {...props}
    />
  )
}
