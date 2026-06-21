'use client'

import Link from 'next/link'
import { MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ServiceOrderableMenu } from '@/components/services/service-orderable-menu'
import { ServiceListingsSection } from '@/components/services/service-listings-section'
import type { PublicServiceProvider, ServiceListing } from '@/lib/types'
import {
  canPlaceServiceOrder,
  formatCoverageArea,
  getProviderListings,
  getProviderMenuItems,
  toWhatsAppUrl,
} from '@/utils/services'

interface ServiceProviderDetailViewProps {
  provider: PublicServiceProvider
  activeListing?: ServiceListing
}

export function ServiceProviderDetailView({
  provider,
  activeListing,
}: ServiceProviderDetailViewProps) {
  const activeCoverage = provider.coverageAreas?.filter((area) => area.isActive) ?? []
  const menuItems = getProviderMenuItems(provider.menuItems)
  const listings = provider.listings ?? []
  const providerListings = getProviderListings(listings)
  const whatsappUrl = provider.whatsapp ? toWhatsAppUrl(provider.whatsapp) : null
  const canOrder = canPlaceServiceOrder(provider.category.slug)
  const hasMenu = menuItems.length > 0

  return (
    <div className="container px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {activeListing && (
            <Button asChild variant="ghost" size="sm" className="gap-2 px-0">
              <Link href={`/services/providers/${provider.id}`}>
                <ArrowRight className="h-4 w-4" />
                العودة لصفحة {provider.businessName}
              </Link>
            </Button>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <Image
                src={provider.logo ?? '/placeholder-property.svg'}
                alt={provider.businessName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{provider.category.name}</Badge>
                {canOrder && hasMenu && (
                  <Badge variant="rent">طلب أونلاين</Badge>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {activeListing ? activeListing.title : provider.businessName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {provider.businessName}
                {activeListing ? ' — إعلان' : ''}
              </p>
              {(activeListing?.description ?? provider.description) && (
                <p className="mt-3 text-slate-600">
                  {activeListing?.description ?? provider.description}
                </p>
              )}
            </div>
          </div>

          {activeCoverage.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">مناطق التغطية</h2>
              <div className="flex flex-wrap gap-2">
                {activeCoverage.map((area) => (
                  <Badge
                    key={area.id ?? `${area.city}-${area.area ?? 'all'}`}
                    variant="outline"
                    className="gap-1 px-3 py-1"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {formatCoverageArea(area)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">منيو {provider.businessName}</h2>
              {canOrder && hasMenu && (
                <p className="mt-1 text-sm text-slate-500">
                  اختر الأصناف من المنيو الكامل ثم أكمل الطلب
                </p>
              )}
            </div>

            {canOrder && hasMenu ? (
              <ServiceOrderableMenu
                menuItems={menuItems}
                listings={listings}
                fixedListingId={activeListing?.id}
              />
            ) : hasMenu ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
                <ul className="divide-y divide-slate-100">
                  {menuItems.map((item) => (
                    <li
                      key={item.id ?? item.name}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        {item.prepTimeMinutes != null && (
                          <p className="text-xs text-slate-400">
                            ~{item.prepTimeMinutes} د
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-primary">
                        {new Intl.NumberFormat('ar-SA', {
                          style: 'currency',
                          currency: 'SAR',
                          maximumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                لا توجد عناصر في المنيو حالياً
              </p>
            )}
          </div>

          {!activeListing && providerListings.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">الإعلانات</h2>
              <ServiceListingsSection providerId={provider.id} listings={listings} />
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {canOrder && hasMenu && (
            <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-4 text-sm text-primary">
              المنيو الكامل للمقدم يظهر أولاً. الطلب يُربط بإعلان محدد عند التأكيد.
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">تواصل</h2>
            <div className="mt-4 flex flex-col gap-2">
              {provider.phone && (
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="h-4 w-4" />
                    اتصال
                  </a>
                </Button>
              )}
              {whatsappUrl && (
                <Button asChild className="w-full gap-2">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    واتساب
                  </a>
                </Button>
              )}
            </div>
          </div>

          {canOrder && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/account/service-orders">طلباتي</Link>
            </Button>
          )}
        </aside>
      </div>
    </div>
  )
}
