'use client'

import { ReviewForm } from '@/components/engagement/review-form'
import { CommentForm } from '@/components/engagement/comment-form'
import type { Comment, Review } from '@/lib/types'

interface PropertyDetailEngagementProps {
  propertyId: string
  initialReviews: Review[]
  initialComments: Comment[]
}

export function PropertyDetailEngagement({
  propertyId,
  initialReviews,
  initialComments,
}: PropertyDetailEngagementProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">التقييمات ({initialReviews.length})</h2>
        <ReviewForm propertyId={propertyId} />
        <div className="mt-4 space-y-3">
          {initialReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{review.user?.name ?? 'مستخدم'}</span>
                <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{review.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">التعليقات ({initialComments.length})</h2>
        <CommentForm propertyId={propertyId} />
        <div className="mt-4 space-y-3">
          {initialComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <span className="font-medium">{comment.user?.name ?? 'مستخدم'}</span>
              <p className="mt-2 text-sm text-slate-600">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
