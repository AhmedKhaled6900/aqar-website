'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ServiceProviderCard } from '@/components/services/service-provider-card'
import { usePublicProviders } from '@/features/services/usePublicProviders'

export function DiscoverServicesSection() {
  const t = useTranslations('services')
  const { data, isLoading } = usePublicProviders({ limit: 4, page: 1 })

  const items = data?.items ?? []

  return (
    <section className="bg-slate-50 py-12">
      <div className="container px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('discover')}</h2>
            <p className="mt-1 text-sm text-slate-600">{t('discoverDesc')}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">{t('viewAll')}</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            {t('noProvidersAvailable')}
          </p>
        )}
      </div>
    </section>
  )
}
