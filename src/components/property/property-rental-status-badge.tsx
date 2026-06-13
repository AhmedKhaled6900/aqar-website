import { Badge } from '@/components/ui/badge'
import type { Property } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PropertyRentalStatusBadgeProps {
  property: Pick<Property, 'purpose' | 'status'>
  className?: string
  size?: 'sm' | 'md'
}

export function PropertyRentalStatusBadge({
  property,
  className,
  size = 'md',
}: PropertyRentalStatusBadgeProps) {
  if (property.purpose !== 'RENT') return null

  const isRented = property.status === 'RENTED'

  return (
    <Badge
      variant="outline"
      className={cn(
        size === 'sm' && 'text-xs',
        isRented
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-primary/25 bg-primary-light text-primary',
        className,
      )}
    >
      {isRented ? 'مؤجرة' : 'متاحة للإيجار'}
    </Badge>
  )
}
