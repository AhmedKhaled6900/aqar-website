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
import { offerSchema, type OfferInput } from '@/schemas/property'
import type { PricePeriod } from '@/lib/types'
import { PRICE_PERIOD_LABELS } from '@/constants/offers'

interface OfferFormProps {
  defaultPricePeriod?: PricePeriod
  submitLabel?: string
  isPending?: boolean
  onSubmit: (data: OfferInput) => Promise<void>
}

export function OfferForm({
  defaultPricePeriod = 'MONTH',
  submitLabel = 'إرسال العرض',
  isPending,
  onSubmit,
}: OfferFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfferInput>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      pricePeriod: defaultPricePeriod,
    },
  })

  const pricePeriod = watch('pricePeriod')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="price">السعر (ر.س)</Label>
        <Input
          id="price"
          type="number"
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>المدة</Label>
        <Select
          value={pricePeriod}
          onValueChange={(v) => setValue('pricePeriod', v as PricePeriod)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المدة" />
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
        <Label htmlFor="notes">ملاحظات (اختياري)</Label>
        <Textarea id="notes" rows={3} {...register('notes')} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'جاري الإرسال...' : submitLabel}
      </Button>
    </form>
  )
}
