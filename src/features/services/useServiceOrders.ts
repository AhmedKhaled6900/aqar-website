'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import type {
  CreateServiceOrderInput,
  PaginatedResponse,
  ServiceOrder,
} from '@/lib/types'

export function useMyServiceOrders(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['services', 'orders', 'my', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<ServiceOrder> | ServiceOrder[]>(
        '/services/my/orders',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<ServiceOrder>(data),
    enabled:
      !!getAccessToken() && hasPermission(PERMISSIONS.SERVICE_ORDER_READ),
  })
}

export function useCreateServiceOrder() {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إرسال الطلب بنجاح' },
    mutationFn: async (input: CreateServiceOrderInput) => {
      const { data } = await axios.post<ServiceOrder>('/services/orders', input)
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['services', 'orders'] })
    },
  })
}
