import { Badge } from '@/components/ui/badge'
import { OFFER_STATUS_LABELS, OFFER_STATUS_VARIANT } from '@/constants/offers'
import type { OfferStatus } from '@/lib/types'

interface OfferStatusBadgeProps {
  status: OfferStatus
}

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  return (
    <Badge variant={OFFER_STATUS_VARIANT[status]}>
      {OFFER_STATUS_LABELS[status]}
    </Badge>
  )
}
