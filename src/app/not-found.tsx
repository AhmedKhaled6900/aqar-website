import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('errors')

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">
        {t('notFound')}
      </h2>
      <p className="mt-2 max-w-md text-slate-600">{t('notFoundDesc')}</p>
      <Button asChild className="mt-6">
        <Link href="/">{t('goHome')}</Link>
      </Button>
    </div>
  )
}
