'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PropertyRentalStatusBadge } from '@/components/property/property-rental-status-badge'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Property } from '@/lib/types'

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: 'demo-1',
    title: 'شقة فاخرة — حي النرجس',
    description: '',
    price: 4500,
    pricePeriod: 'MONTH',
    purpose: 'RENT',
    city: 'الرياض',
    area: 'النرجس',
    address: 'الرياض',
    status: 'APPROVED',
    category: { id: '1', name: 'شقق', slug: 'apartments', parentId: null },
    images: [{ id: '1', imageUrl: '/placeholder-property.svg', isPrimary: true, order: 0 }],
  },
  {
    id: 'demo-2',
    title: 'فيلا عائلية — حي الشاطئ',
    description: '',
    price: 1200000,
    purpose: 'SALE',
    city: 'جدة',
    area: 'الشاطئ',
    address: 'جدة',
    status: 'APPROVED',
    category: { id: '2', name: 'فلل', slug: 'villas', parentId: null },
    images: [{ id: '2', imageUrl: '/placeholder-property.svg', isPrimary: true, order: 0 }],
  },
  {
    id: 'demo-3',
    title: 'مكتب تجاري — الخبر',
    description: '',
    price: 8500,
    pricePeriod: 'MONTH',
    purpose: 'RENT',
    city: 'الخبر',
    area: 'العزيزية',
    address: 'الخبر',
    status: 'RENTED',
    category: { id: '3', name: 'مكاتب', slug: 'offices', parentId: null },
    images: [{ id: '3', imageUrl: '/placeholder-property.svg', isPrimary: true, order: 0 }],
  },
]

interface FloatingMiniCardProps {
  property: Property
  className?: string
  animationClass?: string
  style?: CSSProperties
}

function FloatingMiniCard({
  property,
  className,
  animationClass = 'animate-float',
  style,
}: FloatingMiniCardProps) {
  const imageUrl =
    property.images?.find((i) => i.isPrimary)?.imageUrl ??
    property.images?.[0]?.imageUrl ??
    '/placeholder-property.svg'
  const href = property.id.startsWith('demo-') ? '/properties' : `/properties/${property.id}`

  return (
    <Link
      href={href}
      className={cn(
        'group block w-[220px] overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_24px_48px_rgba(216,62,28,0.2)] sm:w-[250px]',
        animationClass,
        className,
      )}
      style={style}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="240px"
        />
        <div className="absolute top-2 right-2 flex flex-wrap gap-1">
          <Badge variant={property.purpose === 'SALE' ? 'sale' : 'rent'} className="text-[10px]">
            {property.purpose === 'SALE' ? 'بيع' : 'إيجار'}
          </Badge>
          <PropertyRentalStatusBadge property={property} size="sm" />
        </div>
      </div>
      <div className="p-3 text-right">
        <p className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-primary">
          {property.title}
        </p>
        <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
          <span>{property.city}</span>
          <MapPin className="h-3 w-3" />
        </p>
        <p className="mt-2 text-sm font-bold text-primary">
          {formatPrice(property.price, property.purpose, property.pricePeriod)}
        </p>
      </div>
    </Link>
  )
}

interface FloatingPropertyCardsProps {
  properties: Property[]
}

export function FloatingPropertyCards({ properties }: FloatingPropertyCardsProps) {
  const cards = (properties.length >= 3 ? properties.slice(0, 3) : FALLBACK_PROPERTIES).slice(
    0,
    3,
  )

  return (
    <>
      {/* Desktop: stacked floating cards */}
      <div className="relative mx-auto hidden h-[440px] w-full max-w-md lg:block">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-8 top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
          aria-hidden
        />
        <div className="absolute right-0 top-2 z-30 rotate-2 transition-transform duration-300 hover:z-40 hover:rotate-0">
          <FloatingMiniCard
            property={cards[0]!}
            animationClass="animate-float"
            style={{ animationDelay: '0s' }}
          />
        </div>
        <div className="absolute left-0 top-20 z-20 -rotate-3 transition-transform duration-300 hover:z-40 hover:rotate-0">
          <FloatingMiniCard
            property={cards[1]!}
            animationClass="animate-float-slow"
            style={{ animationDelay: '0.8s' }}
          />
        </div>
        <div className="absolute bottom-4 right-10 z-10 rotate-1 transition-transform duration-300 hover:z-40 hover:rotate-0">
          <FloatingMiniCard
            property={cards[2]!}
            animationClass="animate-float-delayed"
            style={{ animationDelay: '1.6s' }}
          />
        </div>
      </div>

      {/* Mobile / tablet: horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 pt-2 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((property, i) => (
          <FloatingMiniCard
            key={property.id}
            property={property}
            className="shrink-0"
            animationClass={
              i === 0 ? 'animate-float' : i === 1 ? 'animate-float-slow' : 'animate-float-delayed'
            }
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
    </>
  )
}
