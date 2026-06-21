'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ServiceOrderForm } from '@/components/services/service-order-form'
import { useActiveRentalLocation } from '@/features/services/useActiveRentalLocation'
import { useCreateServiceOrder } from '@/features/services/useServiceOrders'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/store/auth-store'
import type { CreateServiceOrderFormInput, ServiceOrderCartLine } from '@/schemas/service-order'
import type { ServiceListing, ServiceMenuItem } from '@/lib/types'
import { formatServicePrice, getOrderableListings } from '@/utils/services'

interface ServiceOrderableMenuProps {
  listings: ServiceListing[]
}

function getCartLineKey(listingId: string, item: ServiceMenuItem): string {
  return `${listingId}:${item.id ?? item.name}`
}

export function ServiceOrderableMenu({ listings }: ServiceOrderableMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const permissions = useAuthStore((s) => s.permissions)
  const { location } = useActiveRentalLocation()
  const createOrder = useCreateServiceOrder()
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState<ServiceOrderCartLine[]>([])

  const orderableListings = useMemo(
    () => getOrderableListings(listings),
    [listings],
  )

  const activeListingId = cart[0]?.listingId ?? null
  const activeListing = orderableListings.find((l) => l.id === activeListingId)

  const cartTotal = cart.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  )

  const cartItemCount = cart.reduce((sum, line) => sum + line.quantity, 0)

  const canCreateOrder =
    user?.role === 'CUSTOMER' &&
    permissions.includes(PERMISSIONS.SERVICE_ORDER_CREATE)

  function addItem(listingId: string, item: ServiceMenuItem) {
    setCart((prev) => {
      const base =
        prev.length > 0 && prev[0]!.listingId !== listingId ? [] : prev

      const existing = base.find(
        (line) => line.listingId === listingId && line.name === item.name,
      )

      if (existing) {
        return base.map((line) =>
          line.listingId === listingId && line.name === item.name
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }

      return [
        ...base,
        { listingId, name: item.name, unitPrice: item.price, quantity: 1 },
      ]
    })
  }

  function updateQuantity(listingId: string, item: ServiceMenuItem, delta: number) {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.listingId !== listingId || line.name !== item.name) return line
          return { ...line, quantity: line.quantity + delta }
        })
        .filter((line) => line.quantity > 0),
    )
  }

  function getQuantity(listingId: string, item: ServiceMenuItem): number {
    return (
      cart.find(
        (line) => line.listingId === listingId && line.name === item.name,
      )?.quantity ?? 0
    )
  }

  async function handleSubmit(data: CreateServiceOrderFormInput) {
    try {
      await createOrder.mutateAsync(data)
      setCart([])
      setOpen(false)
      router.push('/account/service-orders')
    } catch {
      // toast handled globally
    }
  }

  if (orderableListings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        لا توجد عناصر في المنيو حالياً
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {orderableListings.map((listing) => (
        <div
          key={listing.id}
          className="rounded-xl border border-slate-200 bg-white shadow-soft"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-medium text-primary">إعلان</p>
            <h3 className="font-semibold text-slate-900">{listing.title}</h3>
            {listing.description && (
              <p className="mt-1 text-sm text-slate-500">{listing.description}</p>
            )}
          </div>
          <ul className="divide-y divide-slate-100">
            {(listing.menuItems ?? []).map((item) => {
              const quantity = getQuantity(listing.id, item)
              return (
                <li
                  key={getCartLineKey(listing.id, item)}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
                    )}
                    <p className="mt-1 font-bold text-primary">
                      {formatServicePrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(listing.id, item, -1)}
                          aria-label={`تقليل ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {quantity}
                        </span>
                      </>
                    )}
                    <Button
                      type="button"
                      variant={quantity > 0 ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`إضافة ${item.name}`}
                      onClick={() =>
                        quantity > 0
                          ? updateQuantity(listing.id, item, 1)
                          : addItem(listing.id, item)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="sticky bottom-4 rounded-xl border border-primary/20 bg-white p-4 shadow-soft-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {activeListing && (
                <p className="text-xs text-slate-500">من إعلان: {activeListing.title}</p>
              )}
              <p className="text-sm text-slate-500">
                {cartItemCount} صنف · {cart.length} سطر
              </p>
              <p className="text-lg font-bold text-primary">
                {formatServicePrice(cartTotal)}
              </p>
            </div>

            {!user ? (
              <Button asChild>
                <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}>
                  سجّل الدخول للطلب
                </Link>
              </Button>
            ) : !canCreateOrder ? (
              <p className="text-sm text-amber-700">
                حسابك غير مفعّل لطلب الخدمات
              </p>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    إتمام الطلب
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      تأكيد الطلب
                      {activeListing ? ` — ${activeListing.title}` : ''}
                    </DialogTitle>
                  </DialogHeader>
                  {activeListingId && (
                    <ServiceOrderForm
                      key={`${activeListingId}-${cart.map((c) => c.quantity).join('-')}`}
                      listingId={activeListingId}
                      cart={cart}
                      defaultDelivery={{
                        city: location?.city,
                        area: location?.area,
                        address: location
                          ? `${location.propertyTitle} — ${location.city} / ${location.area}`
                          : undefined,
                      }}
                      isPending={createOrder.isPending}
                      onSubmit={handleSubmit}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
