'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OfferForm } from '@/components/offer/offer-form'
import { useCounterOffer } from '@/features/offers/useOffers'
import type { OfferInput } from '@/schemas/property'
import type { PricePeriod } from '@/lib/types'
import { getRemainingCustomerOffers } from '@/utils/offers'
import type { PriceOffer } from '@/lib/types'

interface CounterOfferDialogProps {
  offer: PriceOffer
}

export function CounterOfferDialog({ offer }: CounterOfferDialogProps) {
  const [open, setOpen] = useState(false)
  const counterOffer = useCounterOffer(offer.id)
  const remaining = getRemainingCustomerOffers(offer)

  async function onSubmit(data: OfferInput) {
    try {
      await counterOffer.mutateAsync(data)
      setOpen(false)
    } catch {
      // toast handled globally
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>عرض سعر مضاد</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>عرض سعر مضاد</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500">
          متبقي لك {remaining} من أصل 3 عروض في هذه المفاوضة.
        </p>
        <OfferForm
          defaultPricePeriod={offer.pricePeriod}
          submitLabel="إرسال العرض المضاد"
          isPending={counterOffer.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
