'use client'

import { PropertyCard } from '@/components/property/property-card'
import { EmptyState } from '@/components/common/empty-state'
import { PropertyGridSkeleton } from '@/components/common/skeletons'
import { useFavorites } from '@/features/favorites/useFavorites'

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites()

  if (isLoading) return <PropertyGridSkeleton count={3} />

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد عقارات في المفضلة"
        description="أضف عقاراتك المفضلة من صفحة التفاصيل"
        actionLabel="تصفح العقارات"
        actionHref="/properties"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((fav) =>
        fav.property ? (
          <PropertyCard key={fav.id} property={fav.property} />
        ) : null,
      )}
    </div>
  )
}
