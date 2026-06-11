import type { OfferStatus } from '@/lib/types'

export const MAX_OFFERS_PER_PARTY = 3

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  PENDING: 'في انتظار رد المالك',
  NEGOTIATING: 'جاري التفاوض',
  ACCEPTED: 'مقبول',
  REJECTED: 'مرفوض',
  EXPIRED: 'منتهي الصلاحية',
  NEGOTIATING_FAIL: 'تعذّر إكمال التفاوض',
}

export const OFFER_STATUS_VARIANT: Record<
  OfferStatus,
  'default' | 'secondary' | 'outline' | 'sale' | 'rent'
> = {
  PENDING: 'secondary',
  NEGOTIATING: 'rent',
  ACCEPTED: 'default',
  REJECTED: 'outline',
  EXPIRED: 'outline',
  NEGOTIATING_FAIL: 'outline',
}

export const PRICE_PERIOD_LABELS = {
  DAY: 'يومي',
  MONTH: 'شهري',
  YEAR: 'سنوي',
} as const
