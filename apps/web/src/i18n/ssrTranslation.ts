import { getCookieValue } from '@/utils/server-utils'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { cookieName, getOptions } from './settings'

const initI18next = async (lng: any, namespace: any) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, namespace))
  return i18nInstance
}

export async function ssrTranslation(
  lng?: any,
  namespace?: any,
  options = {
    keyPrefix: ''
  }
) {
  const language = getCookieValue(cookieName)
  const i18nextInstance = await initI18next(language, namespace)
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(namespace) ? namespace[0] : namespace,
      options?.keyPrefix
    ),
    i18n: i18nextInstance
  }
}
