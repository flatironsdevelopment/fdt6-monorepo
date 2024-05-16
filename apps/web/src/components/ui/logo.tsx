'use client'

import { mergeTailwindClasses } from '@/utils'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export type LogoProps = {
  className?: string
  testId?: string
  href?: string
}

export const Logo = ({
  className,
  testId = 'logo-id',
  href = '/',
  ...props
}: LogoProps) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const logoPath =
    theme === 'dark'
      ? '/images/logo/light_logo.png'
      : '/images/logo/dark_logo.png'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={mergeTailwindClasses('w-[205px] h-7', className)} />
  }

  return (
    <Link href={href} className={mergeTailwindClasses('w-fit', className)}>
      <Image
        className={mergeTailwindClasses('', className)}
        src={logoPath}
        width={205}
        height={28}
        alt={'logo' + theme}
        data-testid={testId}
        {...props}
      />
    </Link>
  )
}

export const RetractedLogo = ({
  className,
  testId = 'logo-id',
  href = '/',
  ...props
}: LogoProps) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const retractedLogoPath =
    theme === 'dark'
      ? '/images/logo/light_isotype.png'
      : '/images/logo/dark_isotype.png'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-18 h-7" />
  }

  return (
    <Link href={href}>
      <Image
        className={mergeTailwindClasses('', className)}
        src={retractedLogoPath}
        width={72}
        height={28}
        alt="retracted logo"
        data-testid={testId}
        {...props}
      />
    </Link>
  )
}
