import type { BookingStatus, RentalSource } from '@/lib/types'

export const RENTAL_SOURCE_LABELS: Record<RentalSource, string> = {
  DIRECT_BOOKING: 'حجز مباشر',
  NEGOTIATION: 'تفاوض',
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  CANCELLED: 'ملغي',
  COMPLETED: 'مكتمل',
}
