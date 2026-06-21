import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ServiceListing } from '@/lib/types'
import { getProviderListings } from '@/utils/services'

interface ServiceListingsSectionProps {
  providerId: string
  listings: ServiceListing[]
  highlightListingId?: string
}

export function ServiceListingsSection({
  providerId,
  listings,
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

        return (
          <Card
            key={listing.id}
            className={
              isHighlighted
                ? 'border-primary/40 ring-2 ring-primary/20'
                : 'card-interactive'
            }
          >
            <CardHeader className="pb-2">
              <p className="text-xs font-medium text-primary">إعلان</p>
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              {listing.description && (
                <p className="text-sm text-slate-500">{listing.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <Button asChild variant={isHighlighted ? 'default' : 'outline'} size="sm">
                <Link href={href}>
                  {isHighlighted ? 'أنت تشاهد هذا الإعلان' : 'عرض الإعلان والمنيو'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
