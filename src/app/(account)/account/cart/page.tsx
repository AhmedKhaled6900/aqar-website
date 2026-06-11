'use client'

import { PropertyCard } from '@/components/property/property-card'
import { EmptyState } from '@/components/common/empty-state'
import { PropertyGridSkeleton } from '@/components/common/skeletons'
import { useCart } from '@/features/cart/useCart'

export default function CartPage() {
  const { data, isLoading } = useCart()

  if (isLoading) return <PropertyGridSkeleton count={3} />

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="السلة فارغة"
        description="أضف عقارات للسلة من صفحة التفاصيل"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) =>
        item.property ? (
          <PropertyCard key={item.id} property={item.property} />
        ) : null,
      )}
    </div>
  )
}
