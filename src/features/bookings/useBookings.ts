'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken } from '@/lib/auth/tokens'
import type { Booking, CreateBookingInput, PaginatedResponse } from '@/lib/types'
import type { BookingInput } from '@/schemas/property'

export function useMyBookings() {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Booking> | Booking[]>(
        '/bookings/my',
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Booking>(data),
    enabled: !!getAccessToken(),
  })
}

export function useCreateBooking(propertyId: string) {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم تأجير الوحدة بنجاح' },
    mutationFn: async (input: BookingInput) => {
      const body: CreateBookingInput = { propertyId, ...input }
      const { data } = await axios.post<Booking>('/bookings', body)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings'] })
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

export function useCancelBooking() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إلغاء الحجز' },
    mutationFn: async (id: string) => {
      const { data } = await axios.patch<Booking>(`/bookings/${id}/cancel`)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
