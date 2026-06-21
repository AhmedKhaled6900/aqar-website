import { Badge } from '@/components/ui/badge'
import {
  SERVICE_ORDER_STATUS_LABELS,
  SERVICE_ORDER_STATUS_VARIANT,
} from '@/constants/service-orders'
import type { ServiceOrderStatus } from '@/lib/types'
import { getServiceOrderStatusLabel } from '@/utils/services'

interface ServiceOrderStatusBadgeProps {
  status: ServiceOrderStatus | string
}

export function ServiceOrderStatusBadge({ status }: ServiceOrderStatusBadgeProps) {
  const knownStatus = status as ServiceOrderStatus
  const variant =
    SERVICE_ORDER_STATUS_VARIANT[knownStatus] ?? ('outline' as const)
  const label =
    SERVICE_ORDER_STATUS_LABELS[knownStatus] ?? getServiceOrderStatusLabel(status)

  return <Badge variant={variant}>{label}</Badge>
}
