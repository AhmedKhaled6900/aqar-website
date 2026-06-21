'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategorySelectMenu } from '@/features/categories/useCategories'
import { SALE_ENABLED, DEFAULT_PROPERTY_PURPOSE } from '@/constants/features'
import { POPULAR_CITIES } from '@/constants/cities'
import type { PropertyPurpose, PricePeriod } from '@/lib/types'

interface SearchBarProps {
  compact?: boolean
  /** Hero: stacks longer and fits narrow columns beside floating cards */
  variant?: 'default' | 'hero'
  defaultValues?: {
    city?: string
    purpose?: PropertyPurpose
    parentCategoryId?: string
    pricePeriod?: PricePeriod
  }
}

export function SearchBar({ compact, variant = 'default', defaultValues }: SearchBarProps) {
  const isHero = variant === 'hero'
  const router = useRouter()
  const { data: categories = [] } = useCategorySelectMenu()
  const [city, setCity] = useState(defaultValues?.city ?? '')
  const [purpose, setPurpose] = useState<PropertyPurpose | ''>(
    defaultValues?.purpose ?? (SALE_ENABLED ? '' : DEFAULT_PROPERTY_PURPOSE),
  )
  const [parentCategoryId, setParentCategoryId] = useState(
    defaultValues?.parentCategoryId ?? '',
  )
  const [pricePeriod, setPricePeriod] = useState<PricePeriod | ''>(
    defaultValues?.pricePeriod ?? '',
  )

  function handleSearch() {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    const searchPurpose = SALE_ENABLED ? purpose : DEFAULT_PROPERTY_PURPOSE
    if (searchPurpose) params.set('purpose', searchPurpose)
    if (parentCategoryId) params.set('parentCategoryId', parentCategoryId)
    if (pricePeriod && searchPurpose === 'RENT') params.set('pricePeriod', pricePeriod)
    router.push(`/properties?${params.toString()}`)
  }

  const fieldGridClass = compact
    ? 'grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2'
    : isHero
      ? 'grid min-w-0 flex-1 grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-3'
      : 'grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'

  const wrapperClass = compact
    ? 'flex flex-col gap-3 sm:flex-row sm:items-end'
    : isHero
      ? 'animate-slide-up flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft-lg min-[480px]:p-4 xl:flex-row xl:items-end xl:p-5'
      : 'animate-slide-up flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft-lg sm:flex-row sm:items-end sm:p-5'

  const buttonClass = isHero
    ? 'h-10 w-full shrink-0 gap-2 xl:w-auto'
    : 'h-10 w-full shrink-0 gap-2 sm:w-auto'

  return (
    <div className={wrapperClass}>
      <div className={fieldGridClass}>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="overflow-hidden whitespace-nowrap">
            <SelectValue placeholder="المدينة" className="truncate" />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {SALE_ENABLED && (
          <Select
            value={purpose}
            onValueChange={(v) => setPurpose(v as PropertyPurpose)}
          >
            <SelectTrigger className="overflow-hidden whitespace-nowrap">
              <SelectValue placeholder="حالة العقار" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">بيع</SelectItem>
              <SelectItem value="RENT">إيجار</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={parentCategoryId} onValueChange={setParentCategoryId}>
          <SelectTrigger className="overflow-hidden whitespace-nowrap">
            <SelectValue placeholder="التصنيف" className="truncate" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(SALE_ENABLED ? purpose === 'RENT' : true) && (
          <Select
            value={pricePeriod}
            onValueChange={(v) => setPricePeriod(v as PricePeriod)}
          >
            <SelectTrigger className="overflow-hidden whitespace-nowrap">
              <SelectValue placeholder="فترة السعر" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">يومي</SelectItem>
              <SelectItem value="MONTH">شهري</SelectItem>
              <SelectItem value="YEAR">سنوي</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Button onClick={handleSearch} className={buttonClass}>
        <Search className="h-4 w-4" />
        بحث
      </Button>
    </div>
  )
}
