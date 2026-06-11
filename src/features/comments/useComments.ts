'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { getAccessToken, hasPermission } from '@/lib/auth/tokens'
import { PERMISSIONS } from '@/constants/permissions'
import type { Comment, PaginatedResponse } from '@/lib/types'
import type { CommentInput } from '@/schemas/property'

export function usePropertyComments(propertyId: string, page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['comments', propertyId, page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Comment> | Comment[]>(
        `/properties/${propertyId}/comments`,
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Comment>(data),
    enabled: !!propertyId,
  })
}

export function useMyComments(page = 1, limit = 20) {
  const axios = useAxiosInstance()

  return useQuery({
    queryKey: ['comments', 'me', page, limit],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Comment> | Comment[]>(
        '/comments/me',
        { params: { page, limit } },
      )
      return data
    },
    select: (data) => normalizePaginatedResponse<Comment>(data),
    enabled: !!getAccessToken() && hasPermission(PERMISSIONS.COMMENT_READ),
  })
}

export function useCreateComment(propertyId: string) {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'تم إرسال التعليق بنجاح' },
    mutationFn: async (input: CommentInput) => {
      const { data } = await axios.post<Comment>(
        `/properties/${propertyId}/comments`,
        input,
      )
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', propertyId] })
      void queryClient.invalidateQueries({ queryKey: ['comments', 'me'] })
    },
  })
}
