'use client'

import type { ReactNode } from 'react'
import { useActiveRentalLocation } from '@/features/services/useActiveRentalLocation'

interface HomeSectionOrderProps {
  services: ReactNode
  properties: ReactNode
}

export function HomeSectionOrder({ services, properties }: HomeSectionOrderProps) {
  const { location } = useActiveRentalLocation()

  if (location) {
    return (
      <>
        {services}
        {properties}
      </>
    )
  }

  return (
    <>
      {properties}
      {services}
    </>
  )
}
