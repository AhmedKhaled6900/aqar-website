'use client'

import { Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProperty } from '@/features/properties/useProperties'
import { useAuthStore } from '@/store/auth-store'
import {
  formatRentalPeriod,
  formatRentalPrice,
  getRentalSourceLabel,
} from '@/utils/rental'
import type { Property, PropertyRental } from '@/lib/types'

interface PropertyRentalInfoProps {
  propertyId: string
  initialRental?: PropertyRental | null
  initialStatus?: string
}

export function PropertyRentalInfo({
  propertyId,
  initialRental,
  initialStatus,
}: PropertyRentalInfoProps) {
  const user = useAuthStore((s) => s.user)
  const { data: property } = useProperty(propertyId)

  const rental = property?.rental ?? initialRental
  const status = property?.status ?? initialStatus

  if (status !== 'RENTED') return null

  if (!rental) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <Badge variant="rent" className="mb-2">
          مؤجرة
        </Badge>
        <p className="text-sm">هذه الوحدة مؤجرة حالياً وغير متاحة للحجز.</p>
      </div>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary-light/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-primary">
          <Tag className="h-5 w-5" />
          {user ? 'تفاصيل إيجارك' : 'الوحدة مؤجرة'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="rent">مؤجرة</Badge>
          <Badge variant="secondary">{getRentalSourceLabel(rental.source)}</Badge>
        </div>

        <div>
          <p className="text-slate-500">السعر المتفق عليه</p>
          <p className="text-xl font-bold text-primary">
            {formatRentalPrice(rental.agreedPrice, rental.pricePeriod)}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-slate-500" />
          <div>
            <p className="text-slate-500">فترة الإيجار</p>
            <p className="font-medium text-slate-800">
              {formatRentalPeriod(
                rental.duration,
                rental.pricePeriod,
                rental.startedAt,
                rental.endsAt,
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <p className="text-slate-500">تاريخ البداية</p>
            <p className="font-medium">
              {new Date(rental.startedAt).toLocaleDateString('ar-SA', {
                dateStyle: 'medium',
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-500">تاريخ الانتهاء</p>
            <p className="font-medium">
              {new Date(rental.endsAt).toLocaleDateString('ar-SA', {
                dateStyle: 'medium',
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
