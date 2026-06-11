'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import type { PaginatedResponse, Review } from '@/lib/types'
import type { ReviewInput } from '@/schemas/property'

export function usePropertyReviews(propertyId: string, page = 1, limit = 10) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['reviews', propertyId, page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Review> | Review[]>(
        `/properties/${propertyId}/reviews`,
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Review>(data),
    enabled: !!propertyId,
  })
}

export function useMyReviews(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['reviews', 'me', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Review> | Review[]>(
        '/reviews/me',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Review>(data),
    enabled: !!getAccessToken() && hasPermission(PERMISSIONS.REVIEW_READ),
  })
}

export function useCreateReview(propertyId: string) {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إرسال التقييم بنجاح' },
    mutationFn: async (input: ReviewInput) => {
      const { data } = await axios.post<Review>(
        `/properties/${propertyId}/reviews`,
        input,
      )
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] })
      void queryClient.invalidateQueries({ queryKey: ['reviews', 'me'] })
    },
  })
}
