'use client'

import { DiscoverServicesSection } from '@/components/services/discover-services-section'
import { ServicesNearYouSection } from '@/components/services/services-near-you-section'
import { useActiveRentalLocation } from '@/features/services/useActiveRentalLocation'

export function HomeServicesSections() {
  const { location, isLoading } = useActiveRentalLocation()

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-12">
        <div className="container px-4">
          <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </section>
    )
  }

  if (location) {
    return <ServicesNearYouSection location={location} />
  }

  return <DiscoverServicesSection />
}
