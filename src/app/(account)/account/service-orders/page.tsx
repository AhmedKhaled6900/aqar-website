'use client'

import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/common/empty-state'
import { ServiceOrderCard } from '@/components/services/service-order-card'
import { useMyServiceOrders } from '@/features/services/useServiceOrders'

export default function ServiceOrdersPage() {
  const t = useTranslations('account')
  const { data, isLoading } = useMyServiceOrders()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('noOrders')}
        description={t('noOrdersDesc')}
        actionLabel={t('browseServices')}
        actionHref="/services"
      />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {t('ordersCountHint', { count: data?.meta.total ?? items.length })}
      </p>
      {items.map((order) => (
        <ServiceOrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
