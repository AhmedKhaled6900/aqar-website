import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServiceListing } from '@/lib/types'
import { formatServicePrice, getOrderableListings } from '@/utils/services'

interface ServiceListingMenuProps {
  listings: ServiceListing[]
}

export function ServiceListingMenu({ listings }: ServiceListingMenuProps) {
  const visibleListings = getOrderableListings(listings)

  if (visibleListings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        لا توجد عناصر في المنيو حالياً
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {visibleListings.map((listing) => (
        <Card key={listing.id}>
          <CardHeader className="pb-2">
            <p className="text-xs font-medium text-primary">إعلان</p>
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            {listing.description && (
              <p className="text-sm text-slate-500">{listing.description}</p>
            )}
          </CardHeader>
          <CardContent>
            {(listing.menuItems?.length ?? 0) > 0 ? (
              <ul className="divide-y divide-slate-100">
                {listing.menuItems!.map((item, index) => (
                  <li
                    key={item.id ?? `${listing.id}-${index}`}
                    className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      {item.description && (
                        <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
                      )}
                    </div>
                    <p className="shrink-0 font-bold text-primary">
                      {formatServicePrice(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">لا توجد عناصر في المنيو حالياً</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
