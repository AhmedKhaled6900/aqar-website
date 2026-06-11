'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import type { CartItem, PaginatedResponse } from '@/lib/types'

export function useCart(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['cart', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<CartItem> | CartItem[]>(
        '/cart',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<CartItem>(data),
    enabled: !!getAccessToken() && hasPermission(PERMISSIONS.CART_READ),
  })
}

export function useAddToCart() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تمت الإضافة إلى السلة' },
    mutationFn: async (propertyId: string) => {
      await axios.post(`/cart/${propertyId}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useRemoveFromCart() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تمت الإزالة من السلة' },
    mutationFn: async (propertyId: string) => {
      await axios.delete(`/cart/${propertyId}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
