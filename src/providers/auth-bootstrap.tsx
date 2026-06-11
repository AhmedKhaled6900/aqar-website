'use client'

import { useEffect } from 'react'
import { useMe } from '@/features/auth/useMe'
import { getAccessToken } from '@/lib/auth/tokens'
import { useAuthStore } from '@/store/auth-store'

export function AuthBootstrap() {
  const hasToken = !!getAccessToken()
  const { data, isError } = useMe()
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)
  const setHydrated = useAuthStore((s) => s.setHydrated)

  useEffect(() => {
    if (!hasToken) {
      clearSession()
      setHydrated(true)
      return
    }

    if (data) {
      setSession(data.user, data.permissions)
    } else if (isError) {
      clearSession()
    }
  }, [hasToken, data, isError, setSession, clearSession, setHydrated])

  return null
}
