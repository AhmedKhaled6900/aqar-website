'use client'

import { EmptyState } from '@/components/common/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { useMyComments } from '@/features/comments/useComments'
import Link from 'next/link'

export default function CommentsPage() {
  const { data, isLoading } = useMyComments()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد تعليقات"
        description="علّق على العقارات التي اطلعت عليها"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4">
            <Link
              href={`/properties/${comment.propertyId}`}
              className="text-sm font-medium hover:text-emerald-700"
            >
              عقار
            </Link>
            <p className="mt-2 text-sm text-slate-600">{comment.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
