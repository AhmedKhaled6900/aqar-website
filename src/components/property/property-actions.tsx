'use client'

import { Heart, ShoppingCart, Calendar, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OfferDialog } from '@/components/engagement/offer-dialog'
import { useToggleFavorite } from '@/features/favorites/useFavorites'
import { useAddToCart } from '@/features/cart/useCart'
import { useCreateBooking } from '@/features/bookings/useBookings'
import { useAuthStore } from '@/store/auth-store'
import { canCustomerCreateOffer } from '@/utils/offers'
import Link from 'next/link'
import type { Property } from '@/lib/types'

interface PropertyActionsProps {
  property: Property
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const user = useAuthStore((s) => s.user)
  const toggleFavorite = useToggleFavorite()
  const addToCart = useAddToCart()
  const createBooking = useCreateBooking()

  function renderOfferAction() {
    if (!property.isNegotiable) return null

    if (!user) {
      return (
        <Button asChild variant="outline">
          <Link href={`/auth/login?redirect=/properties/${property.id}`}>
            سجّل الدخول لتقديم عرض
          </Link>
        </Button>
      )
    }

    if (!canCustomerCreateOffer(user)) {
      return (
        <Button asChild variant="outline">
          <Link
            href={`/auth/verify-email${user.email ? `?email=${encodeURIComponent(user.email)}` : ''}`}
          >
            فعّل بريدك لتقديم عرض
          </Link>
        </Button>
      )
    }

    return (
      <OfferDialog
        propertyId={property.id}
        defaultPricePeriod={property.pricePeriod}
      />
    )
  }

  if (!user) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href={`/auth/login?redirect=/properties/${property.id}`}>
            سجّل الدخول للتفاعل
          </Link>
        </Button>
        {renderOfferAction()}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() =>
          toggleFavorite.mutate({ propertyId: property.id, isFavorited: false })
        }
        disabled={toggleFavorite.isPending}
      >
        <Heart className="h-4 w-4" />
        مفضلة
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => addToCart.mutate(property.id)}
        disabled={addToCart.isPending}
      >
        <ShoppingCart className="h-4 w-4" />
        السلة
      </Button>
      {renderOfferAction()}
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => createBooking.mutate(property.id)}
        disabled={createBooking.isPending}
      >
        <Calendar className="h-4 w-4" />
        حجز زيارة
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (navigator.share) {
            void navigator.share({
              title: property.title,
              url: window.location.href,
            })
          }
        }}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
