import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ServiceListing } from '@/lib/types'
import {
  formatServicePrice,
  getListingMenuItems,
  getProviderListings,
  hasListingMenu,
  resolveDeliveryFee,
} from '@/utils/services'

interface ServiceListingsSectionProps {
  providerId: string
  listings: ServiceListing[]
  providerDeliveryFee?: number | null
  canOrder?: boolean
  highlightListingId?: string
}

export function ServiceListingsSection({
  providerId,
  listings,
  providerDeliveryFee,
  canOrder = false,
  highlightListingId,
}: ServiceListingsSectionProps) {
  const visibleListings = getProviderListings(listings)

  if (visibleListings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        لا توجد إعلانات حالياً
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visibleListings.map((listing) => {
        const isHighlighted = listing.id === highlightListingId
        const href = `/services/providers/${providerId}/listings/${listing.id}`
        const listingMenu = getListingMenuItems(listing)
        const listingHasMenu = hasListingMenu(listing)
        const deliveryFee = resolveDeliveryFee(
          { deliveryFee: providerDeliveryFee ?? null },
          listing,
        )

        return (
          <Card
            key={listing.id}
            className={
              isHighlighted
                ? 'overflow-hidden border-primary/40 ring-2 ring-primary/20'
                : 'card-interactive overflow-hidden'
            }
          >
            {listing.imageUrl && (
              <div className="relative aspect-[16/9] bg-slate-100">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-primary">إعلان</p>
                {listingHasMenu && (
                  <Badge variant="secondary" className="text-xs">
                    {listingMenu.length} صنف
                  </Badge>
                )}
                {deliveryFee > 0 && (
                  <Badge variant="outline" className="text-xs">
                    توصيل {formatServicePrice(deliveryFee)}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              {listing.description && (
                <p className="line-clamp-2 text-sm text-slate-500">{listing.description}</p>
              )}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {canOrder && (
                <Button asChild size="sm" className="gap-1.5">
                  <Link href={href}>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {isHighlighted ? 'أنت تشاهد هذا الإعلان' : 'اطلب من الإعلان'}
                  </Link>
                </Button>
              )}
              {!canOrder && (
                <Button asChild variant={isHighlighted ? 'default' : 'outline'} size="sm">
                  <Link href={href}>
                    {isHighlighted ? 'أنت تشاهد هذا الإعلان' : 'عرض الإعلان'}
                  </Link>
                </Button>
              )}
              {canOrder && !isHighlighted && (
                <Button asChild variant="outline" size="sm">
                  <Link href={href}>عرض التفاصيل</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
