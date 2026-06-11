import { formatOfferPrice } from '@/utils/offers'
import type { OfferHistoryItem } from '@/lib/types'

interface OfferHistoryProps {
  history: OfferHistoryItem[]
}

export function OfferHistory({ history }: OfferHistoryProps) {
  if (history.length === 0) return null

  const sorted = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-900">سجل المفاوضة</h3>
      <div className="space-y-3">
        {sorted.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-700">
                {item.senderRole === 'CUSTOMER' ? 'أنت' : 'المالك'}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleString('ar-SA')}
              </span>
            </div>
            <p className="mt-1 font-bold text-primary">
              {formatOfferPrice(item.price, item.pricePeriod, item.duration)}
            </p>
            {item.notes && (
              <p className="mt-1 text-sm text-slate-600">{item.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
