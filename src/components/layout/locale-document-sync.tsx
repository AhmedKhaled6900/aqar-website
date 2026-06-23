'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

/** Keeps document lang/dir in sync after client-side locale changes */
export function LocaleDocumentSync() {
  const locale = useLocale()

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  return null
}
