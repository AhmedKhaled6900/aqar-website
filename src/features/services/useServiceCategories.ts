'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { buildServicesQueryParams } from '@/lib/utils'
import type { ServiceCategory, ServiceProviderFilters } from '@/lib/types'

export function useServiceCategories() {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['services', 'categories'],
    queryFn: async () => {
      const { data } = await axios.get<{ items: ServiceCategory[] }>(
        '/services/categories',
      )
      return data.items ?? []
    },
    staleTime: 60_000,
  })
}
