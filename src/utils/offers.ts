import { MAX_OFFERS_PER_PARTY } from '@/constants/offers'
import type { PriceOffer, PricePeriod, User } from '@/lib/types'

export function formatOfferPrice(price: number, pricePeriod: PricePeriod): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price)

  const periodLabels: Record<PricePeriod, string> = {
    DAY: 'يومياً',
    MONTH: 'شهرياً',
    YEAR: 'سنوياً',
  }

  return `${formatted} / ${periodLabels[pricePeriod]}`
}

export function canCustomerCreateOffer(user: User | null): boolean {
  return !!user && user.isVerified
}

export function canCustomerCounter(offer: PriceOffer): boolean {
  if (offer.status !== 'NEGOTIATING') return false
  return (offer.customerOfferCount ?? 0) < MAX_OFFERS_PER_PARTY
}

export function isOfferTerminal(status: PriceOffer['status']): boolean {
  return ['ACCEPTED', 'REJECTED', 'EXPIRED', 'NEGOTIATING_FAIL'].includes(status)
}

export function getRemainingCustomerOffers(offer: PriceOffer): number {
  return Math.max(0, MAX_OFFERS_PER_PARTY - (offer.customerOfferCount ?? 0))
}
