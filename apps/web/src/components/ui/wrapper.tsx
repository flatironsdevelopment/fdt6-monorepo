import { mergeTailwindClasses } from '@/utils'

type Props = {
  className?: string
  testId?: string
  columnDirection?: boolean
  col?: boolean
  center?: boolean
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const Wrapper = ({
  className,
  testId,
  children,
  columnDirection,
  col = false,
  center = false,
  ...props
}: Props) => {
  return (
    <div
      className={mergeTailwindClasses(
        'flex gap-4',
        className,
        (columnDirection || col) && 'flex-col',
        center && 'items-center justify-center'
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  )
}

export const Wrapper4 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-1', props.className)}
    />
  )
}

export const Wrapper8 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-2', props.className)}
    />
  )
}

export const Wrapper12 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-3', props.className)}
    />
  )
}

export const Wrapper16 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-4', props.className)}
    />
  )
}

export const Wrapper20 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-5', props.className)}
    />
  )
}

export const Wrapper24 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-6', props.className)}
    />
  )
}

export const Wrapper32 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-8', props.className)}
    />
  )
}

export const Wrapper40 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-10', props.className)}
    />
  )
}

export const Wrapper48 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-12', props.className)}
    />
  )
}

export const Wrapper64 = ({ ...props }: Props) => {
  return (
    <Wrapper
      {...props}
      className={mergeTailwindClasses('gap-16', props.className)}
    />
  )
}
