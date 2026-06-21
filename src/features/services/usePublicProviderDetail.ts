'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import type { PublicServiceProvider } from '@/lib/types'
import { normalizePublicServiceProvider } from '@/utils/services'

export function usePublicProviderDetail(id: string) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['services', 'providers', id],
    queryFn: async () => {
      const { data } = await axios.get<PublicServiceProvider>(
        `/services/providers/${id}`,
      )
      return normalizePublicServiceProvider(data)
    },
    enabled: !!id,
    staleTime: 60_000,
  })
}
