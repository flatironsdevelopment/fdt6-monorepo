import { cn } from '@/lib/utils'
import { Logo } from './logo'

type Props = {
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

function MobileHeader({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        'flex items-center px-4 py-8 w-full md:hidden bg-primary',
        className
      )}
      {...props}
    >
      <Logo />
    </div>
  )
}

export { MobileHeader }
