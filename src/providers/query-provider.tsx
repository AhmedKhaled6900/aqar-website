'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { getApiErrorMessage } from '@/lib/api/errors'
import { toastError, toastSuccess } from '@/hooks/use-toast'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      successMessage?: string
      errorMessage?: string
      silent?: boolean
    }
  }
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (error, _variables, _context, mutation) => {
              if (mutation.meta?.silent) return
              const message =
                mutation.meta?.errorMessage ?? getApiErrorMessage(error)
              toastError(message)
            },
            onSuccess: (_data, _variables, _context, mutation) => {
              if (mutation.meta?.successMessage) {
                toastSuccess(mutation.meta.successMessage)
              }
            },
          },
        },
      }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
