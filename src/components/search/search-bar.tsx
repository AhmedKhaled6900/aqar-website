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
import { POPULAR_CITIES } from '@/constants/cities'
import type { PropertyPurpose, PricePeriod } from '@/lib/types'

interface SearchBarProps {
  compact?: boolean
  defaultValues?: {
    city?: string
    purpose?: PropertyPurpose
    parentCategoryId?: string
    pricePeriod?: PricePeriod
  }
}

export function SearchBar({ compact, defaultValues }: SearchBarProps) {
  const router = useRouter()
  const { data: categories = [] } = useCategorySelectMenu()
  const [city, setCity] = useState(defaultValues?.city ?? '')
  const [purpose, setPurpose] = useState<PropertyPurpose | ''>(
    defaultValues?.purpose ?? '',
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
    if (purpose) params.set('purpose', purpose)
    if (parentCategoryId) params.set('parentCategoryId', parentCategoryId)
    if (pricePeriod && purpose === 'RENT') params.set('pricePeriod', pricePeriod)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div
      className={
        compact
          ? 'flex flex-col gap-3 sm:flex-row sm:items-end'
          : 'animate-slide-up flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft-lg sm:flex-row sm:items-end sm:p-5'
      }
    >
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {purpose === 'RENT' && (
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

      <Button
        onClick={handleSearch}
        className="h-10 w-full shrink-0 gap-2 sm:w-auto"
      >
        <Search className="h-4 w-4" />
        بحث
      </Button>
    </div>
  )
}
