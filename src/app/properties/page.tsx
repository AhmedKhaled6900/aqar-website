import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PropertyFilters } from '@/components/property/property-filters'
import { PropertiesCatalog } from '@/components/property/properties-catalog'
import { PropertyGridSkeleton } from '@/components/common/skeletons'
import { fetchProperties } from '@/lib/api/server'
import type { PropertyFilters as Filters } from '@/lib/types'

export const metadata: Metadata = {
  title: 'العقارات',
  description: 'تصفح العقارات المعتمدة للبيع والإيجار في السعودية',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: Filters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 12,
    city: typeof params.city === 'string' ? params.city : undefined,
    purpose:
      params.purpose === 'SALE' || params.purpose === 'RENT'
        ? params.purpose
        : undefined,
    pricePeriod:
      params.pricePeriod === 'DAY' ||
      params.pricePeriod === 'MONTH' ||
      params.pricePeriod === 'YEAR'
        ? params.pricePeriod
        : undefined,
    parentCategoryId:
      typeof params.parentCategoryId === 'string'
        ? params.parentCategoryId
        : undefined,
    subcategoryId:
      typeof params.subcategoryId === 'string' ? params.subcategoryId : undefined,
  }

  const data = await fetchProperties(filters).catch(() => ({
    items: [],
    meta: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }))

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">العقارات</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100" />}>
          <PropertyFilters />
        </Suspense>
        <Suspense fallback={<PropertyGridSkeleton />}>
          <PropertiesCatalog initialData={data} filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}
