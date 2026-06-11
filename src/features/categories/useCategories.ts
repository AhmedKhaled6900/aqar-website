'use client'

import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import type { CategorySelectMenuItem, SubcategorySelectMenuItem } from '@/lib/types'

export function useCategorySelectMenu() {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['categories', 'select-menu'],
    queryFn: async () => {
      const { data } = await axios.get<{ items: CategorySelectMenuItem[] }>(
        '/categories/select-menu',
      )
      return data.items
    },
    staleTime: 5 * 60_000,
  })
}

export function useSubcategorySelectMenu(parentId: string) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['subcategories', 'select-menu', parentId],
    queryFn: async () => {
      const { data } = await axios.get<{ items: SubcategorySelectMenuItem[] }>(
        '/subcategories/select-menu',
        { params: { parentId } },
      )
      return data.items
    },
    enabled: !!parentId,
    staleTime: 5 * 60_000,
  })
}
