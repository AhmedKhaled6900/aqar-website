import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ServiceFilters } from '@/components/services/service-filters'
import { ServicesCatalog } from '@/components/services/services-catalog'
import {
  fetchPublicProviders,
  fetchServiceCategories,
} from '@/lib/api/server'
import type { ServiceProviderFilters } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('services')
  return {
    title: t('title'),
    description: t('metaDescription'),
  }
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const t = await getTranslations('services')
  const params = await searchParams
  const filters: ServiceProviderFilters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 12,
    city: typeof params.city === 'string' ? params.city : undefined,
    area: typeof params.area === 'string' ? params.area : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
  }

  const [providers, categoriesData] = await Promise.all([
    fetchPublicProviders(filters).catch(() => ({
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    })),
    fetchServiceCategories().catch(() => ({ items: [] })),
  ])

  const categories = categoriesData.items ?? []

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">{t('title')}</h1>
      <p className="mb-6 text-slate-600">{t('pageSubtitle')}</p>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100" />}>
          <ServiceFilters categories={categories} />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-slate-100" />}>
          <ServicesCatalog initialData={providers} filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}
