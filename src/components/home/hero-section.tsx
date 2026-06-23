import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { SearchBar } from '@/components/search/search-bar'
import { FeaturedListingsCarousel } from '@/components/home/featured-listings-carousel'
import { Button } from '@/components/ui/button'
import { POPULAR_CITIES } from '@/constants/cities'
import type { FeaturedServiceListing } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

const TRUST_KEYS = [
  'trustVerified',
  'trustDirectRent',
  'trustNegotiate',
  'trustBooking',
  'trustArabic',
] as const

const TRUST_MARQUEE_COPIES = 4

interface HeroSectionProps {
  featuredListings: FeaturedServiceListing[]
  totalAvailable?: number
}

export async function HeroSection({ featuredListings, totalAvailable }: HeroSectionProps) {
  const t = await getTranslations()
  const locale = await getLocale()

  const trustItems = Array.from({ length: TRUST_MARQUEE_COPIES }, () =>
    TRUST_KEYS.map((key) => t(`home.${key}`)),
  ).flat()

  return (
    <section className="relative overflow-x-clip bg-gradient-to-b from-primary-light via-white to-white pb-8 pt-8 sm:pb-10 sm:pt-10 md:pb-16 md:pt-14">
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
        <div className="mx-auto min-w-0 max-w-4xl animate-slide-up text-center">
          <Badge className="mb-4 max-w-full whitespace-normal border-primary/20 bg-white/80 px-3 py-1.5 text-xs leading-relaxed text-primary shadow-soft sm:text-sm">
            🇸🇦 {t('home.badge', { appName: t('common.appNameFull') })}
          </Badge>

          <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl md:leading-tight lg:text-5xl">
            {t('home.heroTitle1')}{' '}
            <span className="bg-gradient-to-l from-primary to-primary/80 bg-clip-text text-transparent">
              {t('home.heroTitleHighlight')}
            </span>
            <br />
            {t('home.heroTitle2')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            {t('home.heroSubtitle')}
          </p>

          {totalAvailable != null && totalAvailable > 0 && (
            <p className="mt-3 text-sm font-medium text-primary">
              {t('common.propertiesAvailable', {
                count: totalAvailable.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US'),
              })}
            </p>
          )}
      {featuredListings.length > 0 && (
        <div
          className="relative mt-8 w-full min-w-0 animate-fade-in sm:mt-10 md:mt-12"
          style={{ animationDelay: '0.15s' }}
        >
          <FeaturedListingsCarousel listings={featuredListings} />
        </div>
      )}
          <div className="mx-auto mt-6 w-full min-w-0 sm:mt-8">
            <SearchBar variant="hero" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
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
                {trustItems.map((item, i) => (
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
      </div>


    </section>
  )
}
