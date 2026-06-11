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
import { BookingForm } from '@/components/engagement/booking-form'
import { useCreateBooking } from '@/features/bookings/useBookings'
import type { BookingInput } from '@/schemas/property'
import type { Property } from '@/lib/types'

interface BookingDialogProps {
  property: Property
}

export function BookingDialog({ property }: BookingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const createBooking = useCreateBooking(property.id)

  async function onSubmit(data: BookingInput) {
    try {
      await createBooking.mutateAsync(data)
      setOpen(false)
      router.push('/account/bookings')
      router.refresh()
    } catch {
      // toast handled globally
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          حجز مباشر
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حجز الوحدة</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500">
          سيتم تأجير الوحدة فوراً بسعر الإعلان. يجب تفعيل بريدك الإلكتروني.
        </p>
        <BookingForm
          property={property}
          isPending={createBooking.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
