'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { bookingSchema, type BookingInput } from '@/schemas/property'
import { PRICE_PERIOD_LABELS } from '@/constants/offers'
import { formatPrice } from '@/lib/utils'
import type { PricePeriod, Property } from '@/lib/types'

interface BookingFormProps {
  property: Property
  submitLabel?: string
  isPending?: boolean
  onSubmit: (data: BookingInput) => Promise<void>
}

export function BookingForm({
  property,
  submitLabel = 'تأكيد الحجز',
  isPending,
  onSubmit,
}: BookingFormProps) {
  const defaultPeriod = property.pricePeriod ?? 'MONTH'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pricePeriod: defaultPeriod,
      duration: 1,
    },
  })

  const pricePeriod = watch('pricePeriod')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-lg bg-primary-light p-3 text-sm text-primary">
        سعر الإعلان:{' '}
        <span className="font-semibold">
          {formatPrice(property.price, property.purpose, property.pricePeriod)}
        </span>
      </div>

      <div className="space-y-2">
        <Label>فترة السعر</Label>
        <Select
          value={pricePeriod}
          onValueChange={(v) => setValue('pricePeriod', v as PricePeriod)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PRICE_PERIOD_LABELS) as PricePeriod[]).map((period) => (
              <SelectItem key={period} value={period}>
                {PRICE_PERIOD_LABELS[period]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.pricePeriod && (
          <p className="text-sm text-red-600">{errors.pricePeriod.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">المدة (عدد الوحدات)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          placeholder="مثال: 12 شهر"
          {...register('duration', { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات (اختياري)</Label>
        <Textarea id="notes" rows={3} {...register('notes')} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'جاري الحجز...' : submitLabel}
      </Button>
    </form>
  )
}
