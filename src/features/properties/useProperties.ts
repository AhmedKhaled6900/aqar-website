'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import type { PaginatedResponse, Property, PropertyFilters } from '@/lib/types'

export function useProperties(filters: PropertyFilters = {}) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Property> | Property[]>(
        '/properties',
        { params: filters },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Property>(data),
  })
}

export function useProperty(id: string) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const { data } = await axios.get<Property>(`/properties/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useSimilarProperties(id: string, page = 1, limit = 6) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['properties', id, 'similar', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Property> | Property[]>(
        `/properties/${id}/similar`,
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Property>(data),
    enabled: !!id,
  })
}
