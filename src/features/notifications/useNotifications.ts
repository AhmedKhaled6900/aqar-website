'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken } from '@/lib/auth/tokens'
import type { Notification, PaginatedResponse } from '@/lib/types'

export function useNotifications(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<
        PaginatedResponse<Notification> | Notification[]
      >('/notifications', { params: { page, limit } })
      return data
    },
    select: (data) => normalizePaginatedResponse<Notification>(data),
    enabled: !!getAccessToken(),
    refetchInterval: 60_000,
  })
}
