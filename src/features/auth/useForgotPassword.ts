'use client'

import { useMutation } from '@tanstack/react-query'
import { useAxiosInstance } from '@/hooks/useAxiosInstance'

export function useForgotPassword() {
  const axios = useAxiosInstance()

  return useMutation({
    meta: { successMessage: 'تم إرسال رمز الاستعادة إلى بريدك' },
    mutationFn: async (email: string) => {
      const { data } = await axios.post('/auth/forgot-password', { email })
      return data
    },
  })
}
