export const fallbackLanguage = 'en'
export const languages = [fallbackLanguage, 'es']
export const defaultNamespace = 'translation'
export const cookieName = 'i18next'

export function getOptions(
  lng = fallbackLanguage,
  namespace = defaultNamespace
) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLanguage,
    lng,
    fallbackNS: defaultNamespace,
    defaultNamespace,
    namespace
  }
}
