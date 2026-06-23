'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { routing, type AppLocale } from '@/i18n/routing'

const LOCALES: { code: AppLocale; label: string }[] = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'EN' },
]

const LOCALE_COOKIE_MAX_AGE =
  typeof routing.localeCookie === 'object'
    ? routing.localeCookie.maxAge
    : 60 * 60 * 24 * 365

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as AppLocale
  const router = useRouter()

  function switchLocale(next: AppLocale) {
    if (next === locale) return
    const cookieName =
      typeof routing.localeCookie === 'object'
        ? routing.localeCookie.name
        : 'NEXT_LOCALE'
    document.cookie = `${cookieName}=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};SameSite=Lax`
    router.refresh()
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            locale === code
              ? 'bg-white text-primary shadow-sm'
              : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
