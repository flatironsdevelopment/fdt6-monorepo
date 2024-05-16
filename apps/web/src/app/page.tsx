import { Footer } from '@/i18n/language-switcher'
import { ssrTranslation } from '@/i18n/ssrTranslation'
import { ThemeToggle } from '@/styles/theme/theme-toggle'
import { LinksComponent } from './auth/links'

export default async function Home() {
  const { t } = await ssrTranslation()

  return (
    <>
      <main className="flex bg-background min-h-screen flex-col items-center p-24 gap-4 max-lg:p-4">
        <h1 className="font-semibold text-3xl">{t('title')}</h1>
        <ThemeToggle />

        {/* <ThemeToggle /> */}
        {/* <AuthInfo /> */}

        <Footer />

        <LinksComponent />
      </main>
    </>
  )
}
