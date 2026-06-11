'use client'

import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { useMyReviews } from '@/features/reviews/useReviews'
import Link from 'next/link'

export default function ReviewsPage() {
  const { data, isLoading } = useMyReviews()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد تقييمات"
        description="قيّم العقارات التي زرتها"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/properties/${review.propertyId}`}
                className="font-medium hover:text-primary"
              >
                عقار
              </Link>
              <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{review.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
