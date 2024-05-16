'use client'

import { ThemeProvider } from '@/styles/theme/theme-provider'
import { Toaster } from '@fuel/ui'
import { AuthProvider } from 'api-authentication'

export default function Providers({ children }: any) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="theme"
        enableSystem
      >
        {children}
      </ThemeProvider>

      <Toaster />
    </AuthProvider>
  )
}
