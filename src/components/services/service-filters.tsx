'use client'

import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ServiceCategoryChips } from '@/components/services/service-category-chips'
import { POPULAR_CITIES } from '@/constants/cities'
import type { ServiceCategory } from '@/lib/types'

interface ServiceFiltersProps {
  categories: ServiceCategory[]
}

export function ServiceFilters({ categories }: ServiceFiltersProps) {
  const t = useTranslations('services')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [area, setArea] = useState(searchParams.get('area') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (area) params.set('area', area)
    if (category) params.set('category', category)
    params.set('page', '1')
    router.push(`/services?${params.toString()}`)
  }, [router, city, area, category])

  const clearFilters = () => {
    setCity('')
    setArea('')
    setCategory('')
    router.push('/services')
  }

  return (
    <aside className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft">
      <h2 className="font-semibold text-slate-900">{t('filtersTitle')}</h2>

      <div className="space-y-2">
        <Label>{t('cityFilter')}</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder={tCommon('selectCity')} />
          </SelectTrigger>
          <SelectContent>
            {POPULAR_CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('areaFilter')}</Label>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger>
            <SelectValue placeholder={tCommon('selectArea')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="النرجس">النرجس</SelectItem>
            <SelectItem value="الشاطئ">الشاطئ</SelectItem>
            <SelectItem value="العليا">العليا</SelectItem>
            <SelectItem value="سيدي بشر">سيدي بشر</SelectItem>
            <SelectItem value="العزيزية">العزيزية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>{t('categoryLabel')}</Label>
          <ServiceCategoryChips
            categories={categories}
            selected={category || undefined}
            onSelect={(slug) => setCategory(slug ?? '')}
          />
        </div>
      )}

      <div className="flex gap-2 border-t border-slate-200 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          {tCommon('apply')}
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          {tCommon('clear')}
        </Button>
      </div>
    </aside>
  )
}
