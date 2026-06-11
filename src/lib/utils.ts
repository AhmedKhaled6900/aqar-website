import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PricePeriod, PropertyPurpose } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  purpose: PropertyPurpose,
  pricePeriod?: PricePeriod | null,
): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price)

  if (purpose === 'SALE') return formatted

  const periodLabels: Record<PricePeriod, string> = {
    DAY: 'يومياً',
    MONTH: 'شهرياً',
    YEAR: 'سنوياً',
  }

  return pricePeriod ? `${formatted} / ${periodLabels[pricePeriod]}` : formatted
}

export function buildQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
