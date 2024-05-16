'use client'

import { Button } from '@/components/ui/button'
import { Wrapper } from '@/components/ui/wrapper'
import { languages } from '@/i18n/settings'
import { useCallback } from 'react'
import { useTranslation } from './useTranslation'

export const Footer = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n?.resolvedLanguage

  const handleLanguageChange = useCallback(
    (language: string) => {
      i18n.changeLanguage(language)
    },
    [i18n]
  )

  return (
    <footer style={{ marginTop: 50 }}>
      <p>client translation: {t('title')}</p>
      Current language: <strong>{currentLanguage}</strong> to:{' '}
      <Wrapper className="w-full">
        {languages.map((language) => {
          return (
            <span key={language}>
              <Button onClick={() => handleLanguageChange(language)}>
                Change to {language}
              </Button>
            </span>
          )
        })}
      </Wrapper>
    </footer>
  )
}
