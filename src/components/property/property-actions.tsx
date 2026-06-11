'use client'

import { Heart, ShoppingCart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OfferDialog } from '@/components/engagement/offer-dialog'
import { BookingDialog } from '@/components/engagement/booking-dialog'
import { useToggleFavorite } from '@/features/favorites/useFavorites'
import { useAddToCart } from '@/features/cart/useCart'
import { useAuthStore } from '@/store/auth-store'
import { canCustomerCreateOffer } from '@/utils/offers'
import { canBookProperty } from '@/utils/rental'
import Link from 'next/link'
import type { Property } from '@/lib/types'

interface PropertyActionsProps {
  property: Property
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const user = useAuthStore((s) => s.user)
  const toggleFavorite = useToggleFavorite()
  const addToCart = useAddToCart()

  const isRented = property.status === 'RENTED'
  const canBook = canBookProperty(property.purpose, property.status)
  const canOffer = property.isNegotiable && canBook

  function renderBookingAction() {
    if (!canBook || property.purpose !== 'RENT') return null

    if (!user) {
      return (
        <Button asChild variant="default">
          <Link href={`/auth/login?redirect=/properties/${property.id}`}>
            سجّل الدخول للحجز
          </Link>
        </Button>
      )
    }

    if (!user.isVerified) {
      return (
        <Button asChild variant="outline">
          <Link
            href={`/auth/verify-email${user.email ? `?email=${encodeURIComponent(user.email)}` : ''}`}
          >
            فعّل بريدك للحجز
          </Link>
        </Button>
      )
    }

    return <BookingDialog property={property} />
  }

  function renderOfferAction() {
    if (!canOffer) return null

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

  if (isRented) {
    return (
      <p className="text-sm text-amber-700">
        هذه الوحدة مؤجرة حالياً وغير متاحة للحجز أو التفاوض.
      </p>
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
        {renderBookingAction()}
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
      {renderBookingAction()}
      {renderOfferAction()}
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
