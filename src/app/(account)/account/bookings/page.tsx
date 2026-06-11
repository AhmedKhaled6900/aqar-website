'use client'

import { EmptyState } from '@/components/common/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useMyBookings } from '@/features/bookings/useBookings'
import { BOOKING_STATUS_LABELS } from '@/constants/rental'
import {
  formatRentalPeriod,
  formatRentalPrice,
  getRentalSourceLabel,
} from '@/utils/rental'
import Link from 'next/link'

export default function BookingsPage() {
  const { data, isLoading } = useMyBookings()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد حجوزات"
        description="احجز وحدة للإيجار مباشرة من صفحة تفاصيل العقار"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="space-y-4">
      {items.map((booking) => (
        <Card key={booking.id}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/properties/${booking.propertyId}`}
                  className="font-semibold hover:text-primary"
                >
                  {booking.property?.title ?? 'عقار'}
                </Link>
                {booking.agreedPrice != null && booking.pricePeriod && (
                  <p className="mt-1 text-lg font-bold text-primary">
                    {formatRentalPrice(booking.agreedPrice, booking.pricePeriod)}
                  </p>
                )}
              </div>
              <Badge variant="secondary">
                {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
              </Badge>
            </div>

            {booking.duration != null && booking.pricePeriod && (
              <p className="text-sm text-slate-600">
                {formatRentalPeriod(
                  booking.duration,
                  booking.pricePeriod,
                  booking.startsAt ?? undefined,
                  booking.endsAt ?? undefined,
                )}
              </p>
            )}

            {booking.endsAt && (
              <p className="text-sm text-slate-500">
                ينتهي الإيجار:{' '}
                {new Date(booking.endsAt).toLocaleDateString('ar-SA', {
                  dateStyle: 'full',
                })}
              </p>
            )}

            {booking.property?.rental?.source && (
              <Badge variant="outline">
                {getRentalSourceLabel(booking.property.rental.source)}
              </Badge>
            )}

            {booking.notes && (
              <p className="text-sm text-slate-500">{booking.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
