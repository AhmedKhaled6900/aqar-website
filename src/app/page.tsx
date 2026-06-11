import Link from 'next/link'
import { SearchBar } from '@/components/search/search-bar'
import { PropertyCard } from '@/components/property/property-card'
import { Button } from '@/components/ui/button'
import { fetchProperties, fetchCategorySelectMenu } from '@/lib/api/server'
import { POPULAR_CITIES } from '@/constants/cities'

export default async function HomePage() {
  const [latest, featured, categoriesData] = await Promise.all([
    fetchProperties({ page: 1, limit: 6 }).catch(() => ({
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    })),
    fetchProperties({ page: 1, limit: 4 }).catch(() => ({
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 4,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    })),
    fetchCategorySelectMenu().catch(() => ({ items: [] })),
  ])

  const categories = categoriesData.items ?? []

  return (
    <>
      <section className="animate-fade-in bg-gradient-to-b from-primary-light to-white py-12 md:py-20">
        <div className="container px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">
            اعثر على عقارك المثالي
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 md:text-lg">
            منصة عقارية سعودية — بيع وإيجار بثقة
          </p>
          <div className="mx-auto mt-8 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container animate-slide-up px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">أحدث العقارات</h2>
          <Button asChild variant="outline">
            <Link href="/properties">عرض الكل</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.items.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="container px-4">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">عقارات مميزة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">مدن شائعة</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city}
              href={`/properties?city=${encodeURIComponent(city)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium transition-shadow hover:shadow-md"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="container px-4">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              تصنيفات العقارات
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/properties?parentCategoryId=${cat.id}`}
                  className="card-interactive rounded-xl border border-slate-200 bg-white p-4 text-center font-medium hover:border-primary/30"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
          لماذا تختارنا
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'عقارات موثوقة', desc: 'جميع العقارات معتمدة ومراجعّة' },
            { title: 'بحث ذكي', desc: 'فلاتر متقدمة للوصول لعقارك بسرعة' },
            { title: 'دعم مستمر', desc: 'فريق دعم جاهز لمساعدتك' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 p-6 text-center"
            >
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
