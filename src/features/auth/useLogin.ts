'use client'

import { useMutation } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import { persistAuthResponse } from '@/lib/auth/auth-storage'
import type { AuthResponse } from '@/lib/types'
import type { LoginInput } from '@/schemas/auth'

export function useLogin() {
  const axios = useAxiosInstance()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await axios.post<AuthResponse>('/auth/login', input)
      persistAuthResponse(data)
      return data
    },
    meta: { successMessage: 'تم تسجيل الدخول بنجاح' },
  })
}
