import { Card, CardContent } from '@/components/ui/card'
import { ServiceOrderStatusBadge } from '@/components/services/service-order-status-badge'
import type { ServiceOrder } from '@/lib/types'
import {
  calculateServiceOrderSubtotal,
  calculateServiceOrderTotal,
  formatServicePrice,
} from '@/utils/services'

interface ServiceOrderCardProps {
  order: ServiceOrder
}

export function ServiceOrderCard({ order }: ServiceOrderCardProps) {
  const subtotal = order.subtotal ?? calculateServiceOrderSubtotal(order.items)
  const total = order.total ?? calculateServiceOrderTotal(order.items, order.deliveryFee)

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {order.provider?.businessName ?? 'مقدم خدمة'}
            </p>
            {order.listing?.title && (
              <p className="mt-1 text-sm text-slate-500">{order.listing.title}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {new Date(order.createdAt).toLocaleString('ar-SA', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <ServiceOrderStatusBadge status={order.status} />
        </div>

        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50">
          {order.items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex items-start justify-between gap-3 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {item.name} × {item.quantity}
                </p>
                {item.notes && (
                  <p className="mt-0.5 text-slate-500">{item.notes}</p>
                )}
              </div>
              <p className="shrink-0 text-slate-700">
                {formatServicePrice(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-1 text-sm">
          <p className="text-slate-600">
            التوصيل: {order.deliveryCity} — {order.deliveryArea}
          </p>
          <p className="text-slate-600">{order.deliveryAddress}</p>
          {order.notes && (
            <p className="text-slate-500">ملاحظات: {order.notes}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-500">
            المجموع ({formatServicePrice(subtotal)} + توصيل{' '}
            {formatServicePrice(order.deliveryFee)})
          </span>
          <span className="text-lg font-bold text-primary">
            {formatServicePrice(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
