import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceProviderDetailClient } from '@/components/services/service-provider-detail-client'
import { fetchPublicProviderDetail } from '@/lib/api/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const provider = await fetchPublicProviderDetail(id)
    return {
      title: provider.businessName,
      description: provider.description?.slice(0, 160) ?? undefined,
    }
  } catch {
    return { title: 'مقدم خدمة' }
  }
}

export default async function ServiceProviderDetailPage({ params }: PageProps) {
  const { id } = await params

  let provider
  try {
    provider = await fetchPublicProviderDetail(id)
  } catch {
    notFound()
  }

  return <ServiceProviderDetailClient providerId={id} initialProvider={provider} />
}
