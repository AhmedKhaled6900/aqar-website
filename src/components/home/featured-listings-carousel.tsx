'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FeaturedServiceListing } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatServicePrice } from '@/utils/services'

const FALLBACK_LISTINGS: FeaturedServiceListing[] = [
  {
    id: 'demo-1',
    title: 'عرض الصيف',
    providerId: 'demo',
    providerName: 'مطعم البيت',
    imageUrl: '/placeholder-property.svg',
    categoryName: 'مطاعم',
  },
  {
    id: 'demo-2',
    title: 'بوفيه العائلة',
    providerId: 'demo',
    providerName: 'مطبخ أم سارة',
    imageUrl: '/placeholder-property.svg',
    categoryName: 'طبخ منزلي',
  },
  {
    id: 'demo-3',
    title: 'قهوة الصباح',
    providerId: 'demo',
    providerName: 'كافيه الورد',
    imageUrl: '/placeholder-property.svg',
    categoryName: 'مقاهي',
  },
  {
    id: 'demo-4',
    title: 'وجبة سريعة',
    providerId: 'demo',
    providerName: 'برجر هاوس',
    imageUrl: '/placeholder-property.svg',
    categoryName: 'مطاعم',
  },
]

function getCarouselOffset(index: number, active: number, total: number): number {
  let diff = index - active
  if (diff > total / 2) diff -= total
  if (diff < -total / 2) diff += total
  return diff
}

interface FeaturedListingsCarouselProps {
  listings: FeaturedServiceListing[]
}

export function FeaturedListingsCarousel({ listings }: FeaturedListingsCarouselProps) {
  const items =
    listings.length >= 3 ? listings : listings.length > 0 ? listings : FALLBACK_LISTINGS
  const [active, setActive] = useState(0)
  const total = items.length

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setActive((prev) => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = window.setInterval(goNext, 4500)
    return () => window.clearInterval(timer)
  }, [goNext, total])

  return (
    <div className="relative mx-auto w-full max-w-md px-2">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />

      <p className="mb-6 text-center text-sm font-medium text-slate-500 xl:text-right">
        إعلانات الخدمات المميزة
      </p>

      <div className="relative flex h-[300px] items-center justify-center sm:h-[340px]">
        {items.map((listing, index) => {
          const offset = getCarouselOffset(index, active, total)
          if (Math.abs(offset) > 2) return null

          const isActive = offset === 0
          const href =
            listing.providerId === 'demo'
              ? '/services'
              : `/services/providers/${listing.providerId}/listings/${listing.id}`

          return (
            <Link
              key={`${listing.providerId}-${listing.id}`}
              href={href}
              className={cn(
                'hero-carousel-card absolute flex flex-col items-center text-center transition-all duration-500 ease-out',
                isActive ? 'z-20' : 'z-10',
              )}
              style={{
                transform: `translateX(${offset * 108}px) scale(${isActive ? 1 : 0.78})`,
                opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.55 : 0.25,
              }}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-full bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] ring-4 transition-all duration-500',
                  isActive
                    ? 'h-36 w-36 ring-primary/30 animate-hero-carousel-float sm:h-40 sm:w-40'
                    : 'h-24 w-24 ring-white/90 sm:h-28 sm:w-28',
                )}
              >
                <Image
                  src={listing.imageUrl ?? listing.providerLogo ?? '/placeholder-property.svg'}
                  alt={listing.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="160px"
                />
                {isActive && listing.categoryName && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-center">
                    <Badge className="max-w-[90%] truncate text-[10px] shadow-soft">
                      {listing.categoryName}
                    </Badge>
                  </div>
                )}
              </div>

              {isActive && (
                <div className="mt-4 max-w-[200px] animate-fade-in">
                  <p className="line-clamp-2 text-sm font-bold text-slate-900">{listing.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{listing.providerName}</p>
                  {listing.deliveryFee != null && listing.deliveryFee > 0 && (
                    <p className="mt-1 text-xs font-medium text-primary">
                      توصيل {formatServicePrice(listing.deliveryFee)}
                    </p>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {total > 1 && (
        <>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={goPrev}
              aria-label="الإعلان السابق"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex gap-1.5">
              {items.map((listing, index) => (
                <button
                  key={`dot-${listing.id}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    index === active ? 'w-6 bg-primary' : 'w-2 bg-slate-300 hover:bg-slate-400',
                  )}
                  aria-label={`الإعلان ${index + 1}`}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={goNext}
              aria-label="الإعلان التالي"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 text-center xl:text-right">
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link href="/services">استكشف كل الخدمات</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
