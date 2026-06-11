export type UserRole = 'ADMIN' | 'OWNER' | 'CUSTOMER'

export type PropertyPurpose = 'SALE' | 'RENT'

export type PricePeriod = 'DAY' | 'MONTH' | 'YEAR'

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SOLD'
  | 'RENTED'

export type OfferStatus =
  | 'PENDING'
  | 'NEGOTIATING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NEGOTIATING_FAIL'

export type OfferSenderRole = 'CUSTOMER' | 'OWNER'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: UserRole
  isVerified: boolean
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  permissions: string[]
}

export interface MeResponse {
  user: User
  permissions: string[]
}

export interface PropertyImage {
  id: string
  imageUrl: string
  isPrimary: boolean
  order: number
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  pricePeriod?: PricePeriod | null
  purpose: PropertyPurpose
  city: string
  area: string
  address: string
  latitude?: number | null
  longitude?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  areaSize?: number | null
  isNegotiable?: boolean
  status?: PropertyStatus
  parentCategoryId?: string
  parentCategory?: { id: string; name: string; slug: string } | null
  subcategoryId?: string
  subcategory?: { id: string; name: string; slug: string; parentId?: string | null } | null
  category: { id: string; name: string; slug: string; parentId: string | null }
  images: PropertyImage[]
  videoUrl?: string | null
  owner?: { id: string; name: string }
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface CategorySelectMenuItem {
  id: string
  name: string
  slug: string
  subcategories?: CategorySelectMenuItem[]
}

export interface SubcategorySelectMenuItem {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent?: { id: string; name: string; slug: string } | null
}

export interface Review {
  id: string
  propertyId: string
  userId: string
  rating: number
  content: string
  createdAt: string
  user?: { id: string; name: string }
}

export interface Comment {
  id: string
  propertyId: string
  userId: string
  content: string
  createdAt: string
  user?: { id: string; name: string }
}

export interface Favorite {
  id: string
  propertyId: string
  property?: Property
  createdAt: string
}

export interface CartItem {
  id: string
  propertyId: string
  property?: Property
  createdAt: string
}

export interface OfferHistoryItem {
  id: string
  price: number
  pricePeriod: PricePeriod
  notes?: string | null
  senderRole: OfferSenderRole
  createdAt: string
}

export interface PriceOffer {
  id: string
  propertyId: string
  price: number
  pricePeriod: PricePeriod
  notes?: string | null
  status: OfferStatus
  property?: Property
  customerOfferCount?: number
  ownerOfferCount?: number
  expiresAt?: string | null
  rejectionReason?: string | null
  history?: OfferHistoryItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOfferInput {
  price: number
  pricePeriod: PricePeriod
  notes?: string
}

export interface Booking {
  id: string
  propertyId: string
  status: BookingStatus
  scheduledAt?: string | null
  property?: Property
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  data?: Record<string, unknown> | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  coverImage?: string | null
  publishedAt: string
}

export interface PropertyFilters {
  page?: number
  limit?: number
  purpose?: PropertyPurpose
  pricePeriod?: PricePeriod
  parentCategoryId?: string
  subcategoryId?: string
  city?: string
  sort?: string
}
