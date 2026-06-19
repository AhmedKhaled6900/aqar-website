'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import type { PublicServiceProvider } from '@/lib/types'

export function usePublicProviderDetail(id: string) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['services', 'providers', id],
    queryFn: async () => {
      const { data } = await axios.get<PublicServiceProvider>(
        `/services/providers/${id}`,
      )
      return data
    },
    enabled: !!id,
    staleTime: 60_000,
  })
}
