'use client'

import { ServiceProviderDetailView } from '@/components/services/service-provider-detail-view'
import { usePublicProviderDetail } from '@/features/services/usePublicProviderDetail'
import type { PublicServiceProvider } from '@/lib/types'

interface ServiceProviderDetailClientProps {
  providerId: string
  initialProvider: PublicServiceProvider
}

export function ServiceProviderDetailClient({
  providerId,
  initialProvider,
}: ServiceProviderDetailClientProps) {
  const { data, isLoading } = usePublicProviderDetail(providerId)
  const provider = data ?? initialProvider

  if (isLoading && !data) {
    return (
      <div className="container px-4 py-8">
        <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  return <ServiceProviderDetailView provider={provider} />
}
