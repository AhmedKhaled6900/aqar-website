'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { buildServicesQueryParams } from '@/lib/utils'
import type { PaginatedResponse, PublicServiceProvider, ServiceProviderFilters } from '@/lib/types'

export function usePublicProviders(filters: ServiceProviderFilters = {}) {
  const axios = useAxiosInstance()
  const params = buildServicesQueryParams(filters)

  return useQuery({
    queryKey: ['services', 'providers', filters],
    queryFn: async () => {
      const { data } = await axios.get<
        PaginatedResponse<PublicServiceProvider> | PublicServiceProvider[]
      >('/services/providers', { params })
      return data
    },
    select: (data) => normalizePaginatedResponse<PublicServiceProvider>(data),
    staleTime: 60_000,
  })
}
