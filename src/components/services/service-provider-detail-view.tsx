'use client'

import Link from 'next/link'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ServiceListingMenu } from '@/components/services/service-listing-menu'
import { ServiceOrderableMenu } from '@/components/services/service-orderable-menu'
import type { PublicServiceProvider } from '@/lib/types'
import {
  canPlaceServiceOrder,
  formatCoverageArea,
  getOrderableListings,
  toWhatsAppUrl,
} from '@/utils/services'

interface ServiceProviderDetailViewProps {
  provider: PublicServiceProvider
}

export function ServiceProviderDetailView({ provider }: ServiceProviderDetailViewProps) {
  const activeCoverage = provider.coverageAreas?.filter((area) => area.isActive) ?? []
  const listings = provider.listings ?? []
  const orderableListings = getOrderableListings(listings)
  const whatsappUrl = provider.whatsapp ? toWhatsAppUrl(provider.whatsapp) : null
  const canOrder = canPlaceServiceOrder(provider.category.slug)

  return (
    <div className="container px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
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
                {canOrder && orderableListings.length > 0 && (
                  <Badge variant="rent">طلب أونلاين</Badge>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {provider.businessName}
              </h1>
              {provider.description && (
                <p className="mt-3 text-slate-600">{provider.description}</p>
              )}
            </div>
          </div>

          {activeCoverage.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">مناطق التغطية</h2>
              <div className="flex flex-wrap gap-2">
                {activeCoverage.map((area) => (
                  <Badge
                    key={`${area.city}-${area.area}`}
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-slate-900">منيو الإعلانات</h2>
              {canOrder && orderableListings.length > 0 && (
                <p className="text-sm text-slate-500">
                  اختر الأصناف من كل إعلان ثم أكمل الطلب
                </p>
              )}
            </div>

            {canOrder && orderableListings.length > 0 ? (
              <ServiceOrderableMenu listings={listings} />
            ) : listings.length > 0 ? (
              <ServiceListingMenu listings={listings} />
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                لا توجد إعلانات أو منيو متاح حالياً
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {canOrder && orderableListings.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-4 text-sm text-primary">
              كل إعلان له منيو مستقل. اختر الأصناف (+) ثم اضغط «إتمام الطلب».
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
              {!provider.phone && !whatsappUrl && (
                <p className="text-sm text-slate-500">لا توجد بيانات تواصل متاحة</p>
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
