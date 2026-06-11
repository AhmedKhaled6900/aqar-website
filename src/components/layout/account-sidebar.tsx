'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  Heart,
  MessageSquare,
  ShoppingCart,
  Star,
  Tag,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/account/profile', label: 'الملف الشخصي', icon: User },
  { href: '/account/favorites', label: 'المفضلة', icon: Heart },
  { href: '/account/cart', label: 'السلة', icon: ShoppingCart },
  { href: '/account/offers', label: 'عروض الأسعار', icon: Tag },
  { href: '/account/reviews', label: 'تقييماتي', icon: Star },
  { href: '/account/comments', label: 'تعليقاتي', icon: MessageSquare },
  { href: '/account/bookings', label: 'إيجاراتي', icon: Calendar },
]

export function AccountSidebar() {
  const pathname = usePathname()

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
