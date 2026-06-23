'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">{t('generic')}</h2>
      <p className="mt-2 text-slate-600">{t('tryAgain')}</p>
      <Button onClick={reset} className="mt-6">
        {t('retry')}
      </Button>
    </div>
  )
}
