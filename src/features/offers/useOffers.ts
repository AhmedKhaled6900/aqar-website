'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import type { CreateOfferInput, PaginatedResponse, PriceOffer } from '@/lib/types'

export function useSentOffers(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['offers', 'sent', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<PriceOffer> | PriceOffer[]>(
        '/offers/sent',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<PriceOffer>(data),
    enabled: !!getAccessToken() && hasPermission(PERMISSIONS.OFFER_READ),
  })
}

export function useOffer(id: string) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['offers', id],
    queryFn: async () => {
      const { data } = await axios.get<PriceOffer>(`/offers/${id}`)
      return data
    },
    enabled: !!id && !!getAccessToken(),
  })
}

export function useCreateOffer(propertyId: string) {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إرسال عرض السعر بنجاح' },
    mutationFn: async (input: CreateOfferInput) => {
      const { data } = await axios.post<PriceOffer>(
        `/properties/${propertyId}/offers`,
        input,
      )
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}

export function useCounterOffer(offerId: string) {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إرسال العرض المضاد بنجاح' },
    mutationFn: async (input: CreateOfferInput) => {
      const { data } = await axios.post<PriceOffer>(
        `/offers/${offerId}/counter`,
        input,
      )
      return data
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['offers'] })
      void queryClient.invalidateQueries({ queryKey: ['offers', data.id] })
    },
  })
}
