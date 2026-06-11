'use client'

import { EmptyState } from '@/components/common/empty-state'
import { OfferCard } from '@/components/offer/offer-card'
import { useSentOffers } from '@/features/offers/useOffers'

export default function OffersPage() {
  const { data, isLoading } = useSentOffers()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد عروض أسعار"
        description="قدّم عرض سعر على عقار قابل للتفاوض — يجب تفعيل بريدك الإلكتروني أولاً"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {data?.meta.total ?? items.length} عرض — اضغط على أي عرض لعرض التفاصيل والمفاوضة
      </p>
      {items.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
}
