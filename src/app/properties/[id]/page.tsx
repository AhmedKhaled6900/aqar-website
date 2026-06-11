import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PropertyGallery } from '@/components/property/property-gallery'
import { PropertyMap } from '@/components/property/property-map'
import { PropertyCard } from '@/components/property/property-card'
import { PropertyActions } from '@/components/property/property-actions'
import { PropertyRentalInfo } from '@/components/property/property-rental-info'
import { PropertyDetailEngagement } from '@/components/property/property-detail-engagement'
import { Badge } from '@/components/ui/badge'
import {
  fetchProperty,
  fetchSimilarProperties,
  fetchPropertyReviews,
  fetchPropertyComments,
} from '@/lib/api/server'
import { formatPrice } from '@/lib/utils'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const property = await fetchProperty(id)
    const primaryImage = property.images?.find((i) => i.isPrimary) ?? property.images?.[0]
    return {
      title: property.title,
      description: property.description?.slice(0, 160),
      openGraph: {
        title: property.title,
        description: property.description?.slice(0, 160),
        images: primaryImage ? [primaryImage.imageUrl] : [],
      },
    }
  } catch {
    return { title: 'عقار' }
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params

  let property
  try {
    property = await fetchProperty(id)
  } catch {
    notFound()
  }

  const emptyMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  const [similar, reviews, comments] = await Promise.all([
    fetchSimilarProperties(id, 1, 4).catch(() => ({ items: [], meta: { ...emptyMeta, limit: 4 } })),
    fetchPropertyReviews(id).catch(() => ({ items: [], meta: emptyMeta })),
    fetchPropertyComments(id).catch(() => ({ items: [], meta: { ...emptyMeta, limit: 20 } })),
  ])

  return (
    <div className="container px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />

          {property.videoUrl && (
            <div className="overflow-hidden rounded-xl">
              <video
                src={property.videoUrl}
                controls
                className="aspect-video w-full bg-black"
              />
            </div>
          )}

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            جولة 360° — قريباً
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={property.purpose === 'SALE' ? 'sale' : 'rent'}>
                {property.purpose === 'SALE' ? 'بيع' : 'إيجار'}
              </Badge>
              <Badge variant="secondary">{property.category?.name}</Badge>
              {property.status === 'RENTED' && (
                <Badge variant="outline">مؤجرة</Badge>
              )}
              {property.isNegotiable && property.status !== 'RENTED' && (
                <Badge variant="outline">قابل للتفاوض</Badge>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1 text-slate-500">
              <MapPin className="h-4 w-4" />
              {property.city} — {property.area} — {property.address}
            </p>
            <p className="mt-4 text-2xl font-bold text-primary">
              {formatPrice(property.price, property.purpose, property.pricePeriod)}
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-slate-600">
              {property.bedrooms != null && (
                <span className="flex items-center gap-2">
                  <Bed className="h-5 w-5" /> {property.bedrooms} غرف
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-2">
                  <Bath className="h-5 w-5" /> {property.bathrooms} حمام
                </span>
              )}
              {property.areaSize != null && (
                <span className="flex items-center gap-2">
                  <Maximize className="h-5 w-5" /> {property.areaSize} م²
                </span>
              )}
            </div>
            <p className="mt-6 whitespace-pre-line text-slate-700">
              {property.description}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">الموقع</h2>
            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              address={property.address}
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            سجل الأسعار — قريباً
          </div>

          <PropertyDetailEngagement
            propertyId={id}
            initialReviews={reviews.items}
            initialComments={comments.items}
          />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <PropertyRentalInfo
            propertyId={id}
            initialRental={property.rental}
            initialStatus={property.status}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price, property.purpose, property.pricePeriod)}
            </p>
            {property.owner && (
              <p className="mt-2 text-sm text-slate-500">
                المالك: {property.owner.name}
              </p>
            )}
            <div className="mt-4">
              <PropertyActions property={property} />
            </div>
          </div>
        </aside>
      </div>

      {similar.items.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">عقارات مشابهة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
