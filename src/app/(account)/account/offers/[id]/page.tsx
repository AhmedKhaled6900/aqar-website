'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { CounterOfferDialog } from '@/components/offer/counter-offer-dialog'
import { OfferHistory } from '@/components/offer/offer-history'
import { OfferStatusBadge } from '@/components/offer/offer-status-badge'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOffer } from '@/features/offers/useOffers'
import {
  canCustomerCounter,
  formatOfferPrice,
  getRemainingCustomerOffers,
  isOfferTerminal,
} from '@/utils/offers'
import { OFFER_STATUS_LABELS } from '@/constants/offers'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OfferDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { data: offer, isLoading, isError } = useOffer(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (isError || !offer) {
    return (
      <EmptyState
        title="العرض غير موجود"
        actionLabel="العودة للعروض"
        actionHref="/account/offers"
      />
    )
  }

  const terminal = isOfferTerminal(offer.status)
  const canCounter = canCustomerCounter(offer)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link href="/account/offers">
          <ArrowRight className="h-4 w-4" />
          العودة للعروض
        </Link>
      </Button>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link
                href={`/properties/${offer.propertyId}`}
                className="text-lg font-semibold hover:text-emerald-700"
              >
                {offer.property?.title ?? 'عقار'}
              </Link>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {formatOfferPrice(offer.price, offer.pricePeriod)}
              </p>
            </div>
            <OfferStatusBadge status={offer.status} />
          </div>

          {offer.notes && (
            <div>
              <p className="text-sm font-medium text-slate-500">ملاحظاتك</p>
              <p className="mt-1 text-slate-700">{offer.notes}</p>
            </div>
          )}

          {offer.rejectionReason && offer.status === 'REJECTED' && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              سبب الرفض: {offer.rejectionReason}
            </div>
          )}

          {offer.expiresAt && !terminal && (
            <p className="text-sm text-slate-500">
              ينتهي العرض في:{' '}
              {new Date(offer.expiresAt).toLocaleDateString('ar-SA', {
                dateStyle: 'full',
              })}
            </p>
          )}

          {!terminal && (
            <p className="text-sm text-slate-500">
              عروضك المتبقية: {getRemainingCustomerOffers(offer)} من 3
            </p>
          )}

          {terminal && (
            <p className="text-sm text-slate-600">
              {OFFER_STATUS_LABELS[offer.status]}
            </p>
          )}

          {canCounter && <CounterOfferDialog offer={offer} />}
        </CardContent>
      </Card>

      {offer.history && offer.history.length > 0 && (
        <OfferHistory history={offer.history} />
      )}
    </div>
  )
}
