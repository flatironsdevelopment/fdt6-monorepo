'use client'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import {
  initReactI18next,
  useTranslation as useTranslationLib
} from 'react-i18next'
import { cookieName, getOptions, languages } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator']
    },
    preload: runsOnServerSide ? languages : []
  })

// we use cookies to store the language
// this is specially useful for SSR
// so when we're in the server side we can get the language from the cookie
// that was set on the client side
export function useTranslation(language?: any, namespace?: any, options?: any) {
  const router = useRouter()
  const [cookies, setCookie] = useCookies([cookieName])
  const useTranslationResponse = useTranslationLib(namespace, options)
  const { i18n } = useTranslationResponse

  const cookieStoredLanguage = language || cookies[cookieName]
  const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage)

  useEffect(() => {
    if (activeLanguage === i18n.resolvedLanguage) return
    setActiveLanguage(i18n.resolvedLanguage)
    setCookie(cookieName, i18n.resolvedLanguage, { path: '/' })
    router.refresh()
  }, [activeLanguage, i18n.resolvedLanguage, setCookie, router])

  useEffect(() => {
    if (!cookieStoredLanguage || i18n.resolvedLanguage === cookieStoredLanguage)
      return
    i18n.changeLanguage(cookieStoredLanguage)
  }, [cookieStoredLanguage, i18n])

  return useTranslationResponse
}
