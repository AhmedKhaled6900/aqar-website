import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PublicServiceProvider } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getProviderLocationLabel } from '@/utils/services'

interface ServiceProviderCardProps {
  provider: PublicServiceProvider
  variant?: 'grid' | 'list'
  locationContext?: { city?: string; area?: string }
}

export function ServiceProviderCard({
  provider,
  variant = 'grid',
  locationContext,
}: ServiceProviderCardProps) {
  const imageUrl = provider.logo ?? '/placeholder-property.svg'
  const locationLabel = getProviderLocationLabel(provider, locationContext)

  const content = (
    <>
      <div
        className={cn(
          'relative overflow-hidden bg-slate-100',
          variant === 'grid' ? 'aspect-[4/3]' : 'h-40 w-full sm:h-auto sm:w-56',
        )}
      >
        <Image
          src={imageUrl}
          alt={provider.businessName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">{provider.category.name}</Badge>
        </div>
      </div>
      <CardContent
        className={cn('p-4', variant === 'list' && 'flex flex-1 flex-col justify-center')}
      >
        <h3 className="line-clamp-1 font-semibold text-slate-900 group-hover:text-primary">
          {provider.businessName}
        </h3>
        {provider.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {provider.description}
          </p>
        )}
        {locationLabel && (
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {locationLabel}
          </p>
        )}
      </CardContent>
    </>
  )

  return (
    <Link href={`/services/providers/${provider.id}`} className="group block">
      <Card
        className={cn(
          'card-interactive overflow-hidden',
          variant === 'list' && 'flex flex-col sm:flex-row',
        )}
      >
        {content}
      </Card>
    </Link>
  )
}
