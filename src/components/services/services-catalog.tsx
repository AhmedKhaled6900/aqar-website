'use client'

import Link from 'next/link'
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
  const { items, meta } = initialData

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا يوجد مقدمو خدمة"
        description="جرّب تغيير الفلاتر أو البحث في منطقة أخرى"
        actionLabel="عرض جميع الخدمات"
        actionHref="/services"
      />
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">{meta.total} مقدم خدمة</p>

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
                السابق
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4 text-sm text-slate-600">
            صفحة {meta.page} من {meta.totalPages}
          </span>
          {meta.hasNextPage && (
            <Button asChild variant="outline">
              <Link
                href={{
                  pathname: '/services',
                  query: buildServicesPageQuery(filters, meta.page + 1),
                }}
              >
                التالي
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
