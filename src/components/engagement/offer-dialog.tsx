'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OfferForm } from '@/components/offer/offer-form'
import { useCreateOffer } from '@/features/offers/useOffers'
import type { OfferInput } from '@/schemas/property'
import type { PricePeriod } from '@/lib/types'

interface OfferDialogProps {
  propertyId: string
  defaultPricePeriod?: PricePeriod | null
}

export function OfferDialog({ propertyId, defaultPricePeriod }: OfferDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const createOffer = useCreateOffer(propertyId)

  async function onSubmit(data: OfferInput) {
    try {
      const offer = await createOffer.mutateAsync(data)
      setOpen(false)
      router.push(`/account/offers/${offer.id}`)
    } catch {
      // toast handled globally
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">تقديم عرض سعر</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تقديم عرض سعر</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500">
          يمكنك تقديم حتى 3 عروض. ينتهي العرض تلقائياً بعد 7 أيام بدون رد من المالك.
        </p>
        <OfferForm
          defaultPricePeriod={defaultPricePeriod ?? 'MONTH'}
          isPending={createOffer.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
