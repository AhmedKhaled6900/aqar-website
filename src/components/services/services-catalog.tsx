'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { EmptyState } from '@/components/common/empty-state'
import { ServiceProviderCard } from '@/components/services/service-provider-card'
import { Button } from '@/components/ui/button'
import type { PaginatedResponse, PublicServiceProvider, ServiceProviderFilters } from '@/lib/types'
import { buildServicesPageQuery } from '@/lib/utils'

interface ServicesCatalogProps {
  initialData: PaginatedResponse<PublicServiceProvider>
  filters: ServiceProviderFilters
}

export function ServicesCatalog({ initialData, filters }: ServicesCatalogProps) {
  const t = useTranslations('services')
  const tCommon = useTranslations('common')
  const { items, meta } = initialData

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('noProviders')}
        description={t('emptyDescription')}
        actionLabel={t('viewAllServices')}
        actionHref="/services"
      />
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">{t('providersCount', { count: meta.total })}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((provider) => (
          <ServiceProviderCard
            key={provider.id}
            provider={provider}
            locationContext={{ city: filters.city, area: filters.area }}
          />
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {meta.hasPreviousPage && (
            <Button asChild variant="outline">
              <Link
                href={{
                  pathname: '/services',
                  query: buildServicesPageQuery(filters, meta.page - 1),
                }}
              >
                {tCommon('previous')}
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4 text-sm text-slate-600">
            {tCommon('pageOf', { page: meta.page, totalPages: meta.totalPages })}
          </span>
          {meta.hasNextPage && (
            <Button asChild variant="outline">
              <Link
                href={{
                  pathname: '/services',
                  query: buildServicesPageQuery(filters, meta.page + 1),
                }}
              >
                {tCommon('next')}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
