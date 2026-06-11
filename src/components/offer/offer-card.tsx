import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { OfferStatusBadge } from '@/components/offer/offer-status-badge'
import { formatOfferPrice } from '@/utils/offers'
import type { PriceOffer } from '@/lib/types'

interface OfferCardProps {
  offer: PriceOffer
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Link href={`/account/offers/${offer.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-start justify-between gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 hover:text-primary">
              {offer.property?.title ?? 'عقار'}
            </p>
            <p className="mt-1 text-lg font-bold text-primary">
              {formatOfferPrice(offer.price, offer.pricePeriod, offer.duration)}
            </p>
            {offer.notes && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{offer.notes}</p>
            )}
            {offer.expiresAt && offer.status === 'PENDING' && (
              <p className="mt-2 text-xs text-slate-400">
                ينتهي:{' '}
                {new Date(offer.expiresAt).toLocaleDateString('ar-SA', {
                  dateStyle: 'medium',
                })}
              </p>
            )}
          </div>
          <OfferStatusBadge status={offer.status} />
        </CardContent>
      </Card>
    </Link>
  )
}
