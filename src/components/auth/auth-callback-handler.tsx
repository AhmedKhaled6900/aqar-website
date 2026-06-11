'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { setTokens } from '@/lib/auth/tokens'
import { useQueryClient } from '@tanstack/react-query'

export function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken)
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      router.replace('/')
    } else {
      router.replace('/auth/login')
    }
  }, [searchParams, router, queryClient])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  )
}
