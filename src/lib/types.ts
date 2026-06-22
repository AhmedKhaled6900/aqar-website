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

export type RentalSource = 'DIRECT_BOOKING' | 'NEGOTIATION'

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

export interface PropertyRental {
  agreedPrice: number
  pricePeriod: PricePeriod
  duration: number
  startedAt: string
  endsAt: string
  source: RentalSource
  tenant?: User
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
  rental?: PropertyRental | null
  parentCategoryId?: string
  parentCategory?: { id: string; name: string; slug: string } | null
  subcategoryId?: string
  subcategory?: { id: string; name: string; slug: string; parentId?: string | null } | null
  category: { id: string; name: string; slug: string; parentId: string | null }
  images: PropertyImage[]
  videoUrl?: string | null
  owner?: { id: string; name: string }
  attributes?: PropertyAttributesGroup
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
  duration?: number
  notes?: string | null
  senderRole: OfferSenderRole
  createdAt: string
}

export interface PriceOffer {
  id: string
  propertyId: string
  price: number
  pricePeriod: PricePeriod
  duration?: number
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
  duration: number
  notes?: string
}

export interface CreateBookingInput {
  propertyId: string
  duration: number
  pricePeriod: PricePeriod
  notes?: string
}

export interface Booking {
  id: string
  propertyId: string
  status: BookingStatus
  duration?: number
  pricePeriod?: PricePeriod
  notes?: string | null
  agreedPrice?: number
  startsAt?: string | null
  endsAt?: string | null
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

export type AttributeType =
  | 'TEXT'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'DATE'

export interface PropertySystemAttribute {
  id: string
  attributeId: string
  name: string
  slug: string
  type: AttributeType
  value: unknown
}

export interface PropertyCustomAttribute {
  id: string
  name: string
  type: AttributeType
  value: unknown
}

export interface PropertyAttributesGroup {
  system: PropertySystemAttribute[]
  custom: PropertyCustomAttribute[]
}

export interface SubcategoryAttributeItem {
  id: string
  attributeId?: string
  name: string
  slug: string
  type: AttributeType
  options: string[] | null
  isRequired: boolean
  linkSortOrder: number
}

export interface SubcategoryAttributesResponse {
  subcategoryId: string
  items: SubcategoryAttributeItem[]
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
  attributes?: Record<string, string>
}

export type ServiceListingStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE'

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  sortOrder?: number
}

export interface ServiceCoverageArea {
  id?: string
  city: string
  area?: string | null
  isActive: boolean
}

export interface ServiceMenuItem {
  id?: string
  name: string
  price: number
  description?: string | null
  prepTimeMinutes?: number | null
  sortOrder?: number
}

export interface ServiceListing {
  id: string
  title: string
  description?: string | null
  status?: ServiceListingStatus
  metadata?: Record<string, unknown> | null
  menuItems?: ServiceMenuItem[]
}

export interface PublicServiceProvider {
  id: string
  businessName: string
  description?: string | null
  logo?: string | null
  phone?: string | null
  whatsapp?: string | null
  status?: string
  category: ServiceCategory
  coverageAreas?: ServiceCoverageArea[]
  menuItems?: ServiceMenuItem[]
  listings?: ServiceListing[]
  deliveryFee?: number | null
}

export interface ServiceProviderFilters {
  page?: number
  limit?: number
  city?: string
  area?: string
  category?: string
}

export interface ActiveRentalLocation {
  city: string
  area: string
  propertyTitle: string
  propertyId: string
  rentalId: string
}

export type ServiceOrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'

export interface ServiceOrderItem {
  name: string
  quantity: number
  unitPrice: number
  notes?: string | null
}

export interface CreateServiceOrderItemInput {
  menuItemId: string
  quantity: number
  notes?: string
}

export interface CreateServiceOrderInput {
  providerId: string
  listingId?: string
  items: CreateServiceOrderItemInput[]
  customerPhone: string
  deliveryCity: string
  deliveryArea: string
  deliveryAddress: string
  notes?: string
}

export interface ServiceOrder {
  id: string
  listingId?: string | null
  status: ServiceOrderStatus
  items: ServiceOrderItem[]
  customerPhone?: string | null
  deliveryCity: string
  deliveryArea: string
  deliveryAddress: string
  deliveryFee: number
  notes?: string | null
  subtotal?: number
  total?: number
  provider?: Pick<PublicServiceProvider, 'id' | 'businessName' | 'logo'>
  listing?: Pick<ServiceListing, 'id' | 'title'>
  createdAt: string
  updatedAt?: string
}
