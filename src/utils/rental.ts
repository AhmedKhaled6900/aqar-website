import { PRICE_PERIOD_LABELS } from '@/constants/offers'
import { RENTAL_SOURCE_LABELS } from '@/constants/rental'
import type { PricePeriod, PropertyRental, RentalSource } from '@/lib/types'

export function formatRentalPrice(price: number, pricePeriod: PricePeriod): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price)

  return `${formatted} / ${PRICE_PERIOD_LABELS[pricePeriod]}`
}

export function formatDuration(duration: number, pricePeriod: PricePeriod): string {
  const unitLabels: Record<PricePeriod, [string, string]> = {
    DAY: ['يوم', 'أيام'],
    MONTH: ['شهر', 'أشهر'],
    YEAR: ['سنة', 'سنوات'],
  }
  const [singular, plural] = unitLabels[pricePeriod]
  return `${duration} ${duration === 1 ? singular : plural}`
}

export function formatRentalPeriod(
  duration: number,
  pricePeriod: PricePeriod,
  startsAt?: string,
  endsAt?: string,
): string {
  const durationText = formatDuration(duration, pricePeriod)
  if (startsAt && endsAt) {
    const start = new Date(startsAt).toLocaleDateString('ar-SA', { dateStyle: 'medium' })
    const end = new Date(endsAt).toLocaleDateString('ar-SA', { dateStyle: 'medium' })
    return `${durationText} — من ${start} إلى ${end}`
  }
  return durationText
}

export function getRentalSourceLabel(source: RentalSource): string {
  return RENTAL_SOURCE_LABELS[source]
}

export function isPropertyRented(status?: string): boolean {
  return status === 'RENTED'
}

export function canBookProperty(purpose: string, status?: string): boolean {
  return purpose === 'RENT' && !isPropertyRented(status)
}
