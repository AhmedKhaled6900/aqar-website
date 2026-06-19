'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { ServiceProviderCard } from '@/components/services/service-provider-card'
import { usePublicProviders } from '@/features/services/usePublicProviders'
import type { ActiveRentalLocation } from '@/lib/types'
import { buildServicesPageQuery } from '@/lib/utils'

interface ServicesNearYouSectionProps {
  location: ActiveRentalLocation
}

export function ServicesNearYouSection({ location }: ServicesNearYouSectionProps) {
  const { data, isLoading } = usePublicProviders({
    city: location.city,
    area: location.area,
    limit: 4,
    page: 1,
  })

  const items = data?.items ?? []
  const viewAllHref = `/services?${new URLSearchParams(
    buildServicesPageQuery(
      { city: location.city, area: location.area, limit: 12 },
      1,
    ),
  ).toString()}`

  return (
    <section className="bg-slate-50 py-12">
      <div className="container px-4">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">خدمات بالقرب منك</h2>
            <p className="mt-1 text-sm text-slate-600">
              مقدمو خدمة في منطقة إقامتك
            </p>
            <p className="mt-2 text-sm font-medium text-primary">
              أنت في: {location.propertyTitle} — {location.city} / {location.area}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={viewAllHref}>عرض الكل</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="لا يوجد مقدمو خدمة في منطقتك حالياً"
              description="يمكنك تصفح جميع مقدمي الخدمة في المنصة"
              actionLabel="اكتشف الخدمات"
              actionHref="/services"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                locationContext={{ city: location.city, area: location.area }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
