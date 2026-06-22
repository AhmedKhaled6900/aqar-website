import type {
  Booking,
  PublicServiceProvider,
  ServiceCoverageArea,
  ServiceListing,
  ServiceMenuItem,
} from '@/lib/types'

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
  if (area.area) return `${area.city} — ${area.area}`
  return area.city
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

export function isFoodServiceCategory(slug: string): boolean {
  return (
    slug === 'restaurants' ||
    slug === 'cafes' ||
    slug === 'home-cooking'
  )
}

export function canPlaceServiceOrder(categorySlug: string): boolean {
  return categorySlug !== 'transport'
}

export function isActiveListingStatus(status?: string | null): boolean {
  if (!status) return true
  return status.toUpperCase() === 'ACTIVE'
}

function normalizeMenuItem(raw: unknown): ServiceMenuItem | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const name = typeof item.name === 'string' ? item.name : null
  const priceValue = item.price ?? item.unitPrice
  const price =
    typeof priceValue === 'number'
      ? priceValue
      : typeof priceValue === 'string'
        ? Number(priceValue)
        : NaN

  if (!name || Number.isNaN(price)) return null

  return {
    id: typeof item.id === 'string' ? item.id : undefined,
    name,
    price,
    description:
      typeof item.description === 'string' ? item.description : null,
    prepTimeMinutes:
      typeof item.prepTimeMinutes === 'number' ? item.prepTimeMinutes : null,
    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : undefined,
  }
}

function normalizeListing(raw: unknown): ServiceListing | null {
  if (!raw || typeof raw !== 'object') return null
  const listing = raw as Record<string, unknown>
  const id = typeof listing.id === 'string' ? listing.id : null
  const title = typeof listing.title === 'string' ? listing.title : null
  if (!id || !title) return null

  const rawItems = listing.menuItems ?? listing.items ?? listing.menu
  const menuItems = Array.isArray(rawItems)
    ? rawItems
        .map(normalizeMenuItem)
        .filter((item): item is ServiceMenuItem => item !== null)
    : []

  const statusRaw =
    typeof listing.status === 'string' ? listing.status : 'ACTIVE'

  const imageUrl =
    typeof listing.imageUrl === 'string'
      ? listing.imageUrl
      : typeof listing.image === 'string'
        ? listing.image
        : null

  const deliveryFeeRaw = listing.deliveryFee
  const deliveryFee =
    typeof deliveryFeeRaw === 'number'
      ? deliveryFeeRaw
      : typeof deliveryFeeRaw === 'string'
        ? Number(deliveryFeeRaw)
        : null

  return {
    id,
    title,
    description:
      typeof listing.description === 'string' ? listing.description : null,
    imageUrl,
    status: statusRaw.toUpperCase() as ServiceListing['status'],
    deliveryFee:
      deliveryFee != null && !Number.isNaN(deliveryFee) ? deliveryFee : null,
    metadata:
      listing.metadata && typeof listing.metadata === 'object'
        ? (listing.metadata as Record<string, unknown>)
        : null,
    menuItems,
  }
}

function normalizeMenuItems(raw: unknown): ServiceMenuItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(normalizeMenuItem)
    .filter((item): item is ServiceMenuItem => item !== null)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function normalizePublicServiceProvider(
  raw: PublicServiceProvider | Record<string, unknown>,
): PublicServiceProvider {
  const provider = raw as Record<string, unknown>
  const listingsRaw = provider.listings
  const listings = Array.isArray(listingsRaw)
    ? listingsRaw
        .map(normalizeListing)
        .filter((listing): listing is ServiceListing => listing !== null)
    : []

  const menuItems = normalizeMenuItems(provider.menuItems)

  const deliveryFeeRaw = provider.deliveryFee
  const deliveryFee =
    typeof deliveryFeeRaw === 'number'
      ? deliveryFeeRaw
      : typeof deliveryFeeRaw === 'string'
        ? Number(deliveryFeeRaw)
        : null

  return {
    ...(raw as PublicServiceProvider),
    menuItems,
    listings,
    deliveryFee:
      deliveryFee != null && !Number.isNaN(deliveryFee) ? deliveryFee : null,
  }
}

export function getProviderMenuItems(
  menuItems?: ServiceMenuItem[],
): ServiceMenuItem[] {
  return (menuItems ?? []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function getListingMenuItems(
  listing?: ServiceListing | null,
): ServiceMenuItem[] {
  return getProviderMenuItems(listing?.menuItems)
}

export function hasListingMenu(listing?: ServiceListing | null): boolean {
  return getListingMenuItems(listing).length > 0
}

/** منيو الطلب: منيو الإعلان إن وُجد، وإلا المنيو الرئيسي للبروفايدر */
export function resolveOrderMenuItems(
  provider: Pick<PublicServiceProvider, 'menuItems'>,
  activeListing?: ServiceListing | null,
): ServiceMenuItem[] {
  if (activeListing && hasListingMenu(activeListing)) {
    return getListingMenuItems(activeListing)
  }
  return getProviderMenuItems(provider.menuItems)
}

/** إعلانات المقدم النشطة */
export function getProviderListings(listings: ServiceListing[]): ServiceListing[] {
  return listings.filter((listing) => isActiveListingStatus(listing.status))
}

/** @deprecated use getProviderListings — kept for compatibility */
export function getOrderableListings(listings: ServiceListing[]): ServiceListing[] {
  return getProviderListings(listings)
}

export function resolveOrderListingId(fixedListingId?: string): string | undefined {
  return fixedListingId
}

export function resolveDeliveryFee(
  provider: Pick<PublicServiceProvider, 'deliveryFee'>,
  listing?: ServiceListing | null,
): number {
  if (listing?.deliveryFee != null && !Number.isNaN(listing.deliveryFee)) {
    return listing.deliveryFee
  }
  const listingMeta = listing?.metadata?.deliveryFee
  if (typeof listingMeta === 'number') return listingMeta
  if (typeof listingMeta === 'string') {
    const parsed = Number(listingMeta)
    if (!Number.isNaN(parsed)) return parsed
  }
  if (provider.deliveryFee != null && !Number.isNaN(provider.deliveryFee)) {
    return provider.deliveryFee
  }
  return 0
}

export function calculateServiceOrderSubtotal(
  items: { quantity: number; unitPrice: number }[],
): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

export function calculateServiceOrderTotal(
  items: { quantity: number; unitPrice: number }[],
  deliveryFee: number,
): number {
  return calculateServiceOrderSubtotal(items) + deliveryFee
}

export function getServiceOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'قيد المراجعة',
    ACCEPTED: 'مقبول',
    CONFIRMED: 'مؤكد',
    PREPARING: 'قيد التحضير',
    READY: 'جاهز',
    OUT_FOR_DELIVERY: 'في الطريق',
    DELIVERED: 'تم التسليم',
    CANCELLED: 'ملغي',
    REJECTED: 'مرفوض',
  }
  return labels[status] ?? status
}
