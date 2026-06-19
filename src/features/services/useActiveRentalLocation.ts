'use client'

import { PERMISSIONS } from '@/constants/permissions'
import { useMyBookings } from '@/features/bookings/useBookings'
import { useProperty } from '@/features/properties/useProperties'
import { useAuthStore } from '@/store/auth-store'
import { findActiveRentalBooking } from '@/utils/services'
import type { ActiveRentalLocation } from '@/lib/types'

export function useActiveRentalLocation() {
  const user = useAuthStore((s) => s.user)
  const permissions = useAuthStore((s) => s.permissions)
  const isCustomer = user?.role === 'CUSTOMER'
  const canReadBookings = permissions.includes(PERMISSIONS.BOOKING_READ)
  const enabled = isCustomer && canReadBookings

  const { data: rentals, isLoading: rentalsLoading } = useMyBookings(1, 10)
  const active = enabled ? findActiveRentalBooking(rentals?.items ?? []) : undefined

  const { data: property, isLoading: propertyLoading } = useProperty(
    active?.propertyId ?? '',
  )

  const isLoading =
    enabled && (rentalsLoading || (!!active?.propertyId && propertyLoading))

  if (!enabled || !active || !property) {
    return { location: null as ActiveRentalLocation | null, isLoading }
  }

  const location: ActiveRentalLocation = {
    city: property.city,
    area: property.area,
    propertyTitle: property.title,
    propertyId: property.id,
    rentalId: active.id,
  }

  return { location, isLoading: false }
}
