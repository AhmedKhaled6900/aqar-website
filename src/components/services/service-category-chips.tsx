'use client'

import { cn } from '@/lib/utils'
import type { ServiceCategory } from '@/lib/types'

interface ServiceCategoryChipsProps {
  categories: ServiceCategory[]
  selected?: string
  onSelect: (slug: string | undefined) => void
  className?: string
}

export function ServiceCategoryChips({
  categories,
  selected,
  onSelect,
  className,
}: ServiceCategoryChipsProps) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={cn(
          'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
          !selected
            ? 'border-primary bg-primary text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30',
        )}
      >
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            selected === category.slug
              ? 'border-primary bg-primary text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
