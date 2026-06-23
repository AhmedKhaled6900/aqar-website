'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import type { FeaturedServiceListing } from '@/lib/types'
import { formatServicePrice } from '@/utils/services'

const LISTINGS_MARQUEE_COPIES = 4
const FEATURED_ACCENT = '#ee914540'

interface FeaturedListingsCarouselProps {
  listings: FeaturedServiceListing[]
}

function ListingCard({ listing }: { listing: FeaturedServiceListing }) {
  const t = useTranslations()
  const href = `/services/providers/${listing.providerId}/listings/${listing.id}`
  const image = listing.imageUrl ?? listing.providerLogo ?? '/placeholder-property.svg'

  return (
    <Link
      href={href}
      className="group block w-[180px] shrink-0 overflow-hidden rounded-2xl border bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg sm:w-[200px]"
      style={{ borderColor: FEATURED_ACCENT }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
        {listing.categoryName && (
          <Badge className="absolute top-2 right-2 max-w-[85%] truncate text-[10px] shadow-soft">
            {listing.categoryName}
          </Badge>
        )}
      </div>
      <div className="p-3 text-right">
        <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-primary">
          {listing.title}
        </p>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{listing.providerName}</p>
        {listing.deliveryFee != null && listing.deliveryFee > 0 && (
          <p className="mt-1.5 text-xs font-semibold text-primary">
            {t('services.deliveryFee', { fee: formatServicePrice(listing.deliveryFee) })}
          </p>
        )}
      </div>
    </Link>
  )
}

export function FeaturedListingsCarousel({ listings }: FeaturedListingsCarouselProps) {
  if (listings.length === 0) {
    return null
  }

  const marqueeItems = Array.from({ length: LISTINGS_MARQUEE_COPIES }, () => listings).flat()

  return (
    <div className="w-full min-w-0">
      <div
        className="hero-listings-marquee w-full overflow-hidden border-y py-4 shadow-soft"
        style={{ borderColor: FEATURED_ACCENT, backgroundColor: FEATURED_ACCENT }}
      >
        <div className="hero-listings-track flex w-max items-stretch gap-4">
          {marqueeItems.map((listing, index) => (
            <ListingCard
              key={`${listing.providerId}-${listing.id}-${index}`}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
