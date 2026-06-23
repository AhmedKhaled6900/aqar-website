'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { SALE_ENABLED } from '@/constants/features'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'
import { PropertyRentalStatusBadge } from '@/components/property/property-rental-status-badge'

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list'
}

export function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const t = useTranslations('properties')
  const tCommon = useTranslations('common')

  const primaryImage =
    property.images?.find((img) => img.isPrimary) ?? property.images?.[0]
  const imageUrl = primaryImage?.imageUrl ?? '/placeholder-property.svg'

  const content = (
    <>
      <div
        className={cn(
          'relative overflow-hidden bg-slate-100',
          variant === 'grid' ? 'aspect-[4/3]' : 'h-40 w-full sm:h-auto sm:w-56',
        )}
      >
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
          {SALE_ENABLED ? (
            <Badge variant={property.purpose === 'SALE' ? 'sale' : 'rent'}>
              {property.purpose === 'SALE' ? tCommon('sale') : tCommon('rent')}
            </Badge>
          ) : (
            <Badge variant="rent">{tCommon('rent')}</Badge>
          )}
          {property.purpose === 'RENT' && (
            <PropertyRentalStatusBadge property={property} size="sm" />
          )}
          {property.isNegotiable && property.status !== 'RENTED' && (
            <Badge variant="secondary">{t('negotiable')}</Badge>
          )}
        </div>
        {property.status === 'RENTED' && (
          <div className="absolute inset-0 bg-slate-900/10" aria-hidden />
        )}
      </div>
      <CardContent
        className={cn('p-4', variant === 'list' && 'flex flex-1 flex-col justify-center')}
      >
        <h3 className="line-clamp-1 font-semibold text-slate-900 group-hover:text-primary">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {property.city} — {property.area}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-lg font-bold text-primary">
            {formatPrice(property.price, property.purpose, property.pricePeriod)}
          </p>
          <PropertyRentalStatusBadge property={property} size="sm" />
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          )}
          {property.areaSize != null && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              {property.areaSize} {tCommon('sqm')}
            </span>
          )}
        </div>
      </CardContent>
    </>
  )

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <Card
        className={cn(
          'card-interactive overflow-hidden',
          variant === 'list' && 'flex flex-col sm:flex-row',
        )}
      >
        {content}
      </Card>
    </Link>
  )
}
