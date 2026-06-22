'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { FeaturedServiceListing } from '@/lib/types'
import { formatServicePrice } from '@/utils/services'

interface FeaturedListingsCarouselProps {
  listings: FeaturedServiceListing[]
}

function ListingCard({ listing }: { listing: FeaturedServiceListing }) {
  const href = `/services/providers/${listing.providerId}/listings/${listing.id}`
  const image = listing.imageUrl ?? listing.providerLogo ?? '/placeholder-property.svg'

  return (
    <Link
      href={href}
      className="group block w-[140px] overflow-hidden rounded-2xl border border-white/90 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-[0_20px_44px_rgba(216,62,28,0.18)] sm:w-[152px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="152px"
        />
        {listing.categoryName && (
          <Badge className="absolute top-2 right-2 max-w-[85%] truncate text-[10px] shadow-soft">
            {listing.categoryName}
          </Badge>
        )}
      </div>
      <div className="p-2.5 text-right sm:p-3">
        <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-primary">
          {listing.title}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{listing.providerName}</p>
        {listing.deliveryFee != null && listing.deliveryFee > 0 && (
          <p className="mt-1 text-xs font-semibold text-primary">
            توصيل {formatServicePrice(listing.deliveryFee)}
          </p>
        )}
      </div>
    </Link>
  )
}

export function FeaturedListingsCarousel({ listings }: FeaturedListingsCarouselProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (listings.length <= 1) return
    const timer = window.setInterval(() => {
      setRotation((prev) => (prev + 0.35) % 360)
    }, 40)
    return () => window.clearInterval(timer)
  }, [listings.length])

  if (listings.length === 0) {
    return null
  }

  const radiusX = listings.length <= 2 ? 0 : listings.length === 3 ? 130 : 168
  const radiusY = listings.length <= 2 ? 0 : listings.length === 3 ? 72 : 92

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/15 sm:h-[21rem] sm:w-[21rem]"
        aria-hidden
      />

      <p className="relative mb-4 text-center text-sm font-medium text-slate-500 xl:text-right">
        إعلانات الخدمات المميزة
      </p>

      <div className="relative mx-auto h-[320px] sm:h-[340px]">
        {listings.map((listing, index) => {
          const angleDeg = rotation + (360 / listings.length) * index
          const angleRad = (angleDeg * Math.PI) / 180
          const x = Math.cos(angleRad) * radiusX
          const y = Math.sin(angleRad) * radiusY
          const depth = (Math.cos(angleRad) + 1) / 2
          const scale = 0.88 + depth * 0.12
          const opacity = 0.5 + depth * 0.5
          const zIndex = Math.round(depth * 30)

          return (
            <div
              key={`${listing.providerId}-${listing.id}`}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'transform 0.12s linear, opacity 0.12s linear',
              }}
            >
              <ListingCard listing={listing} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
