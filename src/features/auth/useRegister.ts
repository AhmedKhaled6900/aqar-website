'use client'

import { useMutation } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'
import type { AuthResponse } from '@/lib/types'
import type { RegisterInput } from '@/schemas/auth'

export function useRegister() {
  const axios = useAxiosInstance()

  return useMutation({
    meta: { successMessage: 'تم إنشاء الحساب — تحقق من بريدك الإلكتروني' },
    mutationFn: async (input: RegisterInput) => {
      const { email, password, name, phone } = input
      const { data } = await axios.post<AuthResponse>('/auth/register', {
        name,
        email,
        phone,
        password,
        role: 'CUSTOMER',
      })
      return data
    },
  })
}
