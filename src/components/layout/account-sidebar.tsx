'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import {
  Calendar,
  Heart,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AccountSidebar() {
  const t = useTranslations()
  const pathname = usePathname()

  const items = [
    { href: '/account/profile', label: t('account.profileTitle'), icon: User },
    { href: '/account/favorites', label: t('common.favorites'), icon: Heart },
    { href: '/account/cart', label: t('common.cart'), icon: ShoppingCart },
    { href: '/account/offers', label: t('common.offers'), icon: Tag },
    { href: '/account/reviews', label: t('account.myReviews'), icon: Star },
    { href: '/account/comments', label: t('account.myComments'), icon: MessageSquare },
    { href: '/account/bookings', label: t('account.myRentals'), icon: Calendar },
    { href: '/account/service-orders', label: t('account.myServiceOrders'), icon: ShoppingBag },
  ] as const

  return (
    <aside className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary-light text-primary'
                : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </aside>
  )
}
