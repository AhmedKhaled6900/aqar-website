import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceProviderDetailClient } from '@/components/services/service-provider-detail-client'
import { fetchPublicProviderDetail } from '@/lib/api/server'
import { getProviderListings } from '@/utils/services'

interface PageProps {
  params: Promise<{ id: string; listingId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id, listingId } = await params
    const provider = await fetchPublicProviderDetail(id)
    const listing = getProviderListings(provider.listings ?? []).find(
      (l) => l.id === listingId,
    )
    return {
      title: listing?.title ?? provider.businessName,
      description: listing?.description?.slice(0, 160) ?? provider.description?.slice(0, 160),
    }
  } catch {
    return { title: 'إعلان' }
  }
}

export default async function ServiceListingDetailPage({ params }: PageProps) {
  const { id, listingId } = await params

  let provider
  try {
    provider = await fetchPublicProviderDetail(id)
  } catch {
    notFound()
  }

  const listing = getProviderListings(provider.listings ?? []).find(
    (l) => l.id === listingId,
  )

  if (!listing) {
    notFound()
  }

  return (
    <ServiceProviderDetailClient
      providerId={id}
      initialProvider={provider}
      activeListing={listing}
    />
  )
}
