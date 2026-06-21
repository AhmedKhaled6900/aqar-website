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
import { formatServicePrice, getProviderListings } from '@/utils/services'

interface ServiceOrderableMenuProps {
  menuItems: ServiceMenuItem[]
  listings: ServiceListing[]
  fixedListingId?: string
}

function getCartLineKey(item: ServiceMenuItem): string {
  return item.id ?? item.name
}

export function ServiceOrderableMenu({
  menuItems,
  listings,
  fixedListingId,
}: ServiceOrderableMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const permissions = useAuthStore((s) => s.permissions)
  const { location } = useActiveRentalLocation()
  const createOrder = useCreateServiceOrder()
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState<ServiceOrderCartLine[]>([])

  const availableListings = useMemo(
    () => getProviderListings(listings),
    [listings],
  )

  const cartTotal = cart.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  )

  const cartItemCount = cart.reduce((sum, line) => sum + line.quantity, 0)

  const canCreateOrder =
    user?.role === 'CUSTOMER' &&
    permissions.includes(PERMISSIONS.SERVICE_ORDER_CREATE)

  const canCheckout =
    cart.length > 0 &&
    (fixedListingId != null || availableListings.length > 0)

  function addItem(item: ServiceMenuItem) {
    setCart((prev) => {
      const existing = prev.find(
        (line) => line.name === item.name && line.menuItemId === item.id,
      )
      if (existing) {
        return prev.map((line) =>
          line.name === item.name && line.menuItemId === item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }
      return [
        ...prev,
        {
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
          menuItemId: item.id,
        },
      ]
    })
  }

  function updateQuantity(item: ServiceMenuItem, delta: number) {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.name !== item.name || line.menuItemId !== item.id) return line
          return { ...line, quantity: line.quantity + delta }
        })
        .filter((line) => line.quantity > 0),
    )
  }

  function getQuantity(item: ServiceMenuItem): number {
    return (
      cart.find(
        (line) => line.name === item.name && line.menuItemId === item.id,
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

  if (menuItems.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        لا توجد عناصر في المنيو حالياً
      </p>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        <ul className="divide-y divide-slate-100">
          {menuItems.map((item) => {
            const quantity = getQuantity(item)
            return (
              <li
                key={getCartLineKey(item)}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="font-bold text-primary">
                      {formatServicePrice(item.price)}
                    </p>
                    {item.prepTimeMinutes != null && item.prepTimeMinutes > 0 && (
                      <span className="text-xs text-slate-400">
                        ~{item.prepTimeMinutes} د
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {quantity > 0 && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item, -1)}
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
                      quantity > 0 ? updateQuantity(item, 1) : addItem(item)
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

      {cart.length > 0 && (
        <div className="sticky bottom-4 mt-4 rounded-xl border border-primary/20 bg-white p-4 shadow-soft-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">
                {cartItemCount} صنف · {formatServicePrice(cartTotal)}
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
            ) : !canCheckout ? (
              <p className="text-sm text-amber-700">لا يوجد إعلان مرتبط بالطلب</p>
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
                    <DialogTitle>تأكيد الطلب</DialogTitle>
                  </DialogHeader>
                  <ServiceOrderForm
                    key={cart.map((c) => `${c.name}-${c.quantity}`).join('|')}
                    listings={availableListings}
                    fixedListingId={fixedListingId}
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
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </>
  )
}
