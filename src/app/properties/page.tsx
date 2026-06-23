import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PropertyFilters } from '@/components/property/property-filters'
import { PropertiesCatalog } from '@/components/property/properties-catalog'
import { PropertyGridSkeleton } from '@/components/common/skeletons'
import { fetchProperties } from '@/lib/api/server'
import { resolvePropertyPurposeFilter } from '@/constants/features'
import { parseAttributeFiltersFromSearchParams } from '@/lib/utils'
import type { PropertyFilters as Filters } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('properties')
  return {
    title: t('title'),
    description: t('metaDescription'),
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const t = await getTranslations('properties')
  const params = await searchParams
  const attributeFilters = parseAttributeFiltersFromSearchParams(params)
  const filters: Filters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 12,
    city: typeof params.city === 'string' ? params.city : undefined,
    purpose: resolvePropertyPurposeFilter(
      typeof params.purpose === 'string' ? params.purpose : undefined,
    ),
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
    attributes: Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
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
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{t('title')}</h1>
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
