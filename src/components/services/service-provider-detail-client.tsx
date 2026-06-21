'use client'

import { ServiceProviderDetailView } from '@/components/services/service-provider-detail-view'
import { usePublicProviderDetail } from '@/features/services/usePublicProviderDetail'
import type { PublicServiceProvider, ServiceListing } from '@/lib/types'
import { getProviderListings } from '@/utils/services'

interface ServiceProviderDetailClientProps {
  providerId: string
  initialProvider: PublicServiceProvider
  activeListing?: ServiceListing
}

export function ServiceProviderDetailClient({
  providerId,
  initialProvider,
  activeListing: initialActiveListing,
}: ServiceProviderDetailClientProps) {
  const { data, isLoading } = usePublicProviderDetail(providerId)
  const provider = data ?? initialProvider

  const activeListing =
    initialActiveListing &&
    getProviderListings(provider.listings ?? []).find(
      (l) => l.id === initialActiveListing.id,
    )

  if (isLoading && !data) {
    return (
      <div className="container px-4 py-8">
        <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  return (
    <ServiceProviderDetailView provider={provider} activeListing={activeListing} />
  )
}
