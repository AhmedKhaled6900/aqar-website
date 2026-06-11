'use client'

import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'
import { AxiosProvider } from '@/hooks/useAxiosInstance'
import { QueryProvider } from '@/providers/query-provider'
import { AuthBootstrap } from '@/providers/auth-bootstrap'
import { Toaster } from '@/components/ui/toaster'
import messages from '@/i18n/ar.json'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="ar" messages={messages}>
      <QueryProvider>
        <AxiosProvider>
          <AuthBootstrap />
          {children}
          <Toaster />
        </AxiosProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  )
}
