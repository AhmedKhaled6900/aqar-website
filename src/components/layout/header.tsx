'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'
import { getDashboardUrlForRole } from '@/lib/auth/redirect'
import { clearAuthStorage } from '@/lib/auth/tokens'
import { useQueryClient } from '@tanstack/react-query'
import { BrandLogo } from '@/components/layout/brand-logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/properties', label: 'العقارات' },
  { href: '/services', label: 'الخدمات' },
  { href: '/blog', label: 'المدونة' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
]

export function Header() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const dashboardUrl = user ? getDashboardUrlForRole(user.role) : null

  function handleLogout() {
    clearAuthStorage()
    useAuthStore.getState().clearSession()
    void queryClient.clear()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-header backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <BrandLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-slate-600',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {dashboardUrl ? (
                <Button asChild variant="outline" size="sm">
                  <a href={dashboardUrl}>لوحة التحكم</a>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/account/favorites">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/account/cart">
                      <ShoppingCart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/account/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                خروج
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">دخول</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">تسجيل</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  دخول
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  تسجيل
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
