'use client'

import { EmptyState } from '@/components/common/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMyBookings, useCancelBooking } from '@/features/bookings/useBookings'
import Link from 'next/link'

export default function BookingsPage() {
  const { data, isLoading } = useMyBookings()
  const cancelBooking = useCancelBooking()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد حجوزات"
        description="احجز زيارة لعقار من صفحة التفاصيل"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <Link
                href={`/properties/${booking.propertyId}`}
                className="font-semibold hover:text-emerald-700"
              >
                {booking.property?.title ?? 'عقار'}
              </Link>
              {booking.scheduledAt && (
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(booking.scheduledAt).toLocaleDateString('ar-SA')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{booking.status}</Badge>
              {booking.status === 'PENDING' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelBooking.mutate(booking.id)}
                  disabled={cancelBooking.isPending}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
