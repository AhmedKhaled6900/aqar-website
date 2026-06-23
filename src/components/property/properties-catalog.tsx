'use client'

import { LayoutGrid, List, Map } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { PropertyCard } from '@/components/property/property-card'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/ui-store'
import type { PaginatedResponse, Property, PropertyFilters } from '@/lib/types'
import { cn, buildPropertiesPageQuery } from '@/lib/utils'

interface PropertiesCatalogProps {
  initialData: PaginatedResponse<Property>
  filters: PropertyFilters
}

export function PropertiesCatalog({ initialData, filters }: PropertiesCatalogProps) {
  const t = useTranslations('properties')
  const tCommon = useTranslations('common')
  const viewMode = useUiStore((s) => s.propertyViewMode)
  const setViewMode = useUiStore((s) => s.setPropertyViewMode)
  const { items, meta } = initialData

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('noProperties')}
        description={t('emptyDescription')}
        actionLabel={t('viewAllProperties')}
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{t('propertiesCount', { count: meta.total })}</p>
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label={t('gridView')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label={t('listView')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('map')}
            aria-label={t('mapView')}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
          {t('mapComingSoon')}
        </div>
      ) : (
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-col gap-4',
          )}
        >
          {items.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant={viewMode === 'list' ? 'list' : 'grid'}
            />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {meta.hasPreviousPage && (
            <Button asChild variant="outline">
              <Link
                href={{
                  pathname: '/properties',
                  query: buildPropertiesPageQuery(filters, meta.page - 1),
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
                  pathname: '/properties',
                  query: buildPropertiesPageQuery(filters, meta.page + 1),
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
