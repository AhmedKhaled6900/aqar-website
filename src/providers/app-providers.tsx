'use client'

import type { ReactNode } from 'react'
import { AxiosProvider } from '@/hooks/useAxiosInstance'
import { QueryProvider } from '@/providers/query-provider'
import { AuthBootstrap } from '@/providers/auth-bootstrap'
import { Toaster } from '@/components/ui/toaster'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AxiosProvider>
        <AuthBootstrap />
        {children}
        <Toaster />
      </AxiosProvider>
    </QueryProvider>
  )
}
