import Link from 'next/link'
import { SearchBar } from '@/components/search/search-bar'
import { FloatingPropertyCards } from '@/components/home/floating-property-cards'
import { APP_NAME } from '@/constants/branding'
import { Button } from '@/components/ui/button'
import { POPULAR_CITIES } from '@/constants/cities'
import type { Property } from '@/lib/types'
import { Badge } from '../ui/badge'

const TRUST_ITEMS = [
  'عقارات معتمدة',
  'إيجار مباشر',
  'تفاوض على السعر',
  'حجز مباشر',
  'دعم بالعربي',
] as const

const TRUST_MARQUEE_COPIES = 4
const TRUST_MARQUEE_ITEMS = Array.from({ length: TRUST_MARQUEE_COPIES }, () => [
  ...TRUST_ITEMS,
]).flat()

interface HeroSectionProps {
  properties: Property[]
  totalAvailable?: number
}

export function HeroSection({ properties, totalAvailable }: HeroSectionProps) {
  return (
    <section className="relative overflow-x-clip bg-gradient-to-b from-primary-light via-white to-white pb-8 pt-8 sm:pb-10 sm:pt-10 md:pb-16 md:pt-14">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary-muted/50 blur-3xl"
        aria-hidden
      />
      <div
        className="hero-grid-pattern pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      />

      <div className="container relative min-w-0 px-4">
        <div className="grid min-w-0 items-center gap-8 xl:grid-cols-2 xl:gap-12">
          {/* Content — RTL start (right) */}
          <div className="min-w-0 animate-slide-up text-center xl:text-right">
            <Badge className="mb-4 max-w-full whitespace-normal border-primary/20 bg-white/80 px-3 py-1.5 text-xs leading-relaxed text-primary shadow-soft sm:text-sm">
              🇸🇦 {APP_NAME} — المملكة العربية السعودية
            </Badge>

            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl md:leading-tight xl:text-[3.25rem]">
              أجر{' '}
              <span className="bg-gradient-to-l from-primary to-primary/80 bg-clip-text text-transparent">
                عقارك
              </span>
              <br />
              في السعودية
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base md:text-lg xl:mx-0">
              شقق، فلل، مكاتب — حجز مباشر، تفاوض على السعر، وعقارات معتمدة في
              مدن المملكة.
            </p>

            {totalAvailable != null && totalAvailable > 0 && (
              <p className="mt-3 text-sm font-medium text-primary">
                +{totalAvailable.toLocaleString('ar-SA')} عقار متاح الآن
              </p>
            )}

            <div className="mx-auto mt-6 w-full min-w-0 sm:mt-8 xl:mx-0">
              <SearchBar variant="hero" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 xl:justify-start">
              {POPULAR_CITIES.slice(0, 5).map((city) => (
                <Button key={city} asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={`/properties?city=${encodeURIComponent(city)}&purpose=RENT`}>
                    {city}
                  </Link>
                </Button>
              ))}
            </div>

            <div className="mt-6 w-full min-w-0">
              <div className="hero-trust-marquee overflow-hidden rounded-full border border-slate-200/80 bg-white/70 py-2 shadow-soft">
                <div className="hero-trust-track flex w-max gap-5 whitespace-nowrap text-sm text-slate-600">
                  {TRUST_MARQUEE_ITEMS.map((item, i) => (
                    <span
                      key={`${item}-${i}`}
                      className="inline-flex shrink-0 items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards — RTL end (left) */}
          <div
            className="min-w-0 animate-fade-in xl:animate-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            <FloatingPropertyCards properties={properties} />
          </div>
        </div>
      </div>
    </section>
  )
}
