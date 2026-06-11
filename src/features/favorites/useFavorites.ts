'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import { toastSuccess } from '@/hooks/use-toast'
import type { Favorite, PaginatedResponse } from '@/lib/types'

export function useFavorites(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['favorites', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Favorite> | Favorite[]>(
        '/favorites',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Favorite>(data),
    enabled: !!getAccessToken() && hasPermission(PERMISSIONS.FAVORITE_READ),
  })
}

export function useToggleFavorite() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      isFavorited,
    }: {
      propertyId: string
      isFavorited: boolean
    }) => {
      if (isFavorited) {
        await axios.delete(`/favorites/${propertyId}`)
      } else {
        await axios.post(`/favorites/${propertyId}`)
      }
    },
    onSuccess: (_data, { isFavorited }) => {
      toastSuccess(isFavorited ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة')
      void queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
