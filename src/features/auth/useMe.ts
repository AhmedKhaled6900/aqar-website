'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { getAccessToken } from '@/lib/auth/tokens'
import { storePermissions } from '@/lib/auth/tokens'
import type { MeResponse } from '@/lib/types'

export function useMe() {
  const axios = useAxiosInstance()
  const hasToken = !!getAccessToken()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await axios.get<MeResponse>('/auth/me')
      storePermissions(data.permissions)
      return data
    },
    enabled: hasToken,
    retry: false,
  })
}
