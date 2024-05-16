import { siteConfig } from '@/config/site'
import { languages } from '@/i18n/settings'
import { fontSans } from '@/styles/fonts'
import { mergeTailwindClasses } from '@/utils'
import '@fuel/ui/tailwind-styles.css'
import { dir } from 'i18next'
import { Metadata } from 'next'
import Providers from './providers'

export async function getLanguages() {
  return languages.map((language) => ({ language }))
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  manifest: '/assets/site.webmanifest',
  icons: {
    icon: '/assets/favicon.ico',
    shortcut: '/assets/favicon-16x16.png',
    apple: '/assets/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { language: string }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const languages = await getLanguages()
  const language = languages[0].language

  return (
    <>
      <html lang={language} dir={dir(language)} suppressHydrationWarning>
        <head />
        <body
          suppressHydrationWarning
          className={mergeTailwindClasses(
            'bg-background font-sans antialiased md:min-h-[768px]',
            fontSans.variable
          )}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </>
  )
}
