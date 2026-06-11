'use client'

import { useRouter, useSearchParams } from 'next/navigation'
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
import {
  useCategorySelectMenu,
  useSubcategorySelectMenu,
} from '@/features/categories/useCategories'
import { POPULAR_CITIES } from '@/constants/cities'
import type { PricePeriod, PropertyPurpose } from '@/lib/types'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [purpose, setPurpose] = useState<PropertyPurpose | ''>(
    (searchParams.get('purpose') as PropertyPurpose) ?? '',
  )
  const [parentCategoryId, setParentCategoryId] = useState(
    searchParams.get('parentCategoryId') ?? '',
  )
  const [subcategoryId, setSubcategoryId] = useState(
    searchParams.get('subcategoryId') ?? '',
  )
  const [pricePeriod, setPricePeriod] = useState<PricePeriod | ''>(
    (searchParams.get('pricePeriod') as PricePeriod) ?? '',
  )

  const { data: categories = [] } = useCategorySelectMenu()
  const { data: subcategories = [] } = useSubcategorySelectMenu(parentCategoryId)

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (purpose) params.set('purpose', purpose)
    if (parentCategoryId) params.set('parentCategoryId', parentCategoryId)
    if (subcategoryId) params.set('subcategoryId', subcategoryId)
    if (pricePeriod && purpose === 'RENT') params.set('pricePeriod', pricePeriod)
    params.set('page', '1')
    router.push(`/properties?${params.toString()}`)
  }, [router, city, purpose, parentCategoryId, subcategoryId, pricePeriod])

  const clearFilters = () => {
    setCity('')
    setPurpose('')
    setParentCategoryId('')
    setSubcategoryId('')
    setPricePeriod('')
    router.push('/properties')
  }

  return (
    <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-900">الفلاتر</h2>

      <div className="space-y-2">
        <Label>المدينة</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المدينة" />
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
        <Label>الغرض</Label>
        <Select
          value={purpose}
          onValueChange={(v) => setPurpose(v as PropertyPurpose)}
        >
          <SelectTrigger>
            <SelectValue placeholder="بيع / إيجار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SALE">بيع</SelectItem>
            <SelectItem value="RENT">إيجار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>التصنيف الرئيسي</Label>
        <Select
          value={parentCategoryId}
          onValueChange={(v) => {
            setParentCategoryId(v)
            setSubcategoryId('')
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {parentCategoryId && subcategories.length > 0 && (
        <div className="space-y-2">
          <Label>التصنيف الفرعي</Label>
          <Select value={subcategoryId} onValueChange={setSubcategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="اختياري" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {purpose === 'RENT' && (
        <div className="space-y-2">
          <Label>فترة السعر</Label>
          <Select
            value={pricePeriod}
            onValueChange={(v) => setPricePeriod(v as PricePeriod)}
          >
            <SelectTrigger>
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">يومي</SelectItem>
              <SelectItem value="MONTH">شهري</SelectItem>
              <SelectItem value="YEAR">سنوي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button onClick={applyFilters} className="flex-1">
          تطبيق
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          مسح
        </Button>
      </div>
    </aside>
  )
}
