import type { ServiceOrderStatus } from '@/lib/types'

export const FOOD_SERVICE_CATEGORY_SLUGS = [
  'restaurants',
  'cafes',
  'home-cooking',
] as const

export const SERVICE_ORDER_STATUS_LABELS: Record<ServiceOrderStatus, string> = {
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

export const SERVICE_ORDER_STATUS_VARIANT: Record<
  ServiceOrderStatus,
  'default' | 'secondary' | 'outline' | 'sale' | 'rent'
> = {
  PENDING: 'outline',
  ACCEPTED: 'secondary',
  CONFIRMED: 'rent',
  PREPARING: 'secondary',
  READY: 'secondary',
  OUT_FOR_DELIVERY: 'rent',
  DELIVERED: 'rent',
  CANCELLED: 'outline',
  REJECTED: 'outline',
}
