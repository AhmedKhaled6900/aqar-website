import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

const LOCALE_COOKIE_NAME =
  (typeof routing.localeCookie === 'object'
    ? routing.localeCookie.name
    : undefined) ?? 'NEXT_LOCALE'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  const locale = hasLocale(routing.locales, cookieLocale)
    ? cookieLocale
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  }
})
