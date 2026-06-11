'use client'

import { useMutation } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { persistAuthResponse } from '@/lib/auth/auth-storage'
import type { AuthResponse } from '@/lib/types'
import type { VerifyEmailInput } from '@/schemas/auth'

export function useVerifyEmail() {
  const axios = useAxiosInstance()

  return useMutation({
    meta: { successMessage: 'تم تفعيل البريد الإلكتروني بنجاح' },
    mutationFn: async (input: VerifyEmailInput) => {
      const { data } = await axios.post<AuthResponse>('/auth/verify-email', input)
      persistAuthResponse(data)
      return data
    },
  })
}
