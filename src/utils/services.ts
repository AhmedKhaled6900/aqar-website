import type { Booking, PublicServiceProvider, ServiceCoverageArea } from '@/lib/types'

const ACTIVE_RENTAL_STATUSES = ['ACTIVE', 'CONFIRMED'] as const

export function isActiveRentalBooking(booking: Booking): boolean {
  if (!ACTIVE_RENTAL_STATUSES.includes(booking.status as (typeof ACTIVE_RENTAL_STATUSES)[number])) {
    return false
  }
  if (!booking.endsAt) return false
  return new Date(booking.endsAt) > new Date()
}

export function findActiveRentalBooking(bookings: Booking[]): Booking | undefined {
  return bookings
    .filter(isActiveRentalBooking)
    .sort((a, b) => {
      const aStart = new Date(a.startsAt ?? a.createdAt).getTime()
      const bStart = new Date(b.startsAt ?? b.createdAt).getTime()
      return bStart - aStart
    })[0]
}

export function getProviderLocationLabel(
  provider: PublicServiceProvider,
  context?: { city?: string; area?: string },
): string {
  if (context?.city && context.area) {
    return `${context.city} — ${context.area}`
  }

  const activeArea = provider.coverageAreas?.find((area) => area.isActive)
  if (activeArea) {
    return `${activeArea.city} — ${activeArea.area}`
  }

  return provider.coverageAreas?.[0]
    ? formatCoverageArea(provider.coverageAreas[0]!)
    : ''
}

export function formatCoverageArea(area: ServiceCoverageArea): string {
  return `${area.city} — ${area.area}`
}

export function toWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

export function formatServicePrice(price: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price)
}
