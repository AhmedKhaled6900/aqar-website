'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AttributeFilterField } from '@/components/property/attribute-filter-field'
import {
  useCategorySelectMenu,
  useSubcategorySelectMenu,
} from '@/features/categories/useCategories'
import { useSubcategoryAttributes } from '@/features/attributes/useAttributes'
import { POPULAR_CITIES } from '@/constants/cities'
import {
  DEFAULT_PROPERTY_PURPOSE,
  SALE_ENABLED,
} from '@/constants/features'
import { parseAttributeFiltersFromSearchParams } from '@/lib/utils'
import type { PricePeriod, PropertyPurpose } from '@/lib/types'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialAttributes = useMemo(
    () => parseAttributeFiltersFromSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  )

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [purpose, setPurpose] = useState<PropertyPurpose | ''>(() => {
    const fromUrl = searchParams.get('purpose') as PropertyPurpose | null
    if (!SALE_ENABLED) return DEFAULT_PROPERTY_PURPOSE
    return fromUrl === 'SALE' || fromUrl === 'RENT' ? fromUrl : ''
  })
  const [parentCategoryId, setParentCategoryId] = useState(
    searchParams.get('parentCategoryId') ?? '',
  )
  const [subcategoryId, setSubcategoryId] = useState(
    searchParams.get('subcategoryId') ?? '',
  )
  const [pricePeriod, setPricePeriod] = useState<PricePeriod | ''>(
    (searchParams.get('pricePeriod') as PricePeriod) ?? '',
  )
  const [attributeFilters, setAttributeFilters] =
    useState<Record<string, string>>(initialAttributes)

  const { data: categories = [] } = useCategorySelectMenu()
  const { data: subcategories = [] } = useSubcategorySelectMenu(parentCategoryId)
  const { data: subcategoryAttributes } = useSubcategoryAttributes(subcategoryId)

  useEffect(() => {
    setAttributeFilters(initialAttributes)
  }, [initialAttributes])

  useEffect(() => {
    if (!subcategoryId) {
      setAttributeFilters({})
    }
  }, [subcategoryId])

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    const activePurpose = SALE_ENABLED ? purpose : DEFAULT_PROPERTY_PURPOSE
    if (activePurpose) params.set('purpose', activePurpose)
    if (parentCategoryId) params.set('parentCategoryId', parentCategoryId)
    if (subcategoryId) params.set('subcategoryId', subcategoryId)
    if (pricePeriod && activePurpose === 'RENT') params.set('pricePeriod', pricePeriod)
    Object.entries(attributeFilters).forEach(([slug, value]) => {
      if (value) params.set(`attributes[${slug}]`, value)
    })
    params.set('page', '1')
    router.push(`/properties?${params.toString()}`)
  }, [router, city, purpose, parentCategoryId, subcategoryId, pricePeriod, attributeFilters])

  const clearFilters = () => {
    setCity('')
    setPurpose(SALE_ENABLED ? '' : DEFAULT_PROPERTY_PURPOSE)
    setParentCategoryId('')
    setSubcategoryId('')
    setPricePeriod('')
    setAttributeFilters({})
    router.push(SALE_ENABLED ? '/properties' : '/properties?purpose=RENT')
  }

  const attributeItems = subcategoryAttributes?.items ?? []
  const hasAttributeFilters = attributeItems.length > 0

  return (
    <aside className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">الفلاتر</h2>
      </div>

      <Accordion defaultValue={['location', 'type', 'category']} className="border-t border-slate-200">
        <AccordionItem value="location" title="الموقع">
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
        </AccordionItem>

        <AccordionItem value="type" title={SALE_ENABLED ? 'نوع العرض' : 'فترة الإيجار'}>
          <div className="space-y-4">
            {SALE_ENABLED && (
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
            )}

            {(SALE_ENABLED ? purpose === 'RENT' : true) && (
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
          </div>
        </AccordionItem>

        <AccordionItem value="category" title="التصنيف">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>التصنيف الرئيسي</Label>
              <Select
                value={parentCategoryId}
                onValueChange={(v) => {
                  setParentCategoryId(v)
                  setSubcategoryId('')
                  setAttributeFilters({})
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
          </div>
        </AccordionItem>

        {hasAttributeFilters && (
          <AccordionItem value="attributes" title="خصائص العقار">
            <div className="space-y-4">
              {attributeItems.map((attr) => (
                <AttributeFilterField
                  key={attr.id}
                  attribute={attr}
                  value={attributeFilters[attr.slug] ?? ''}
                  onChange={(value) =>
                    setAttributeFilters((prev) => ({
                      ...prev,
                      [attr.slug]: value,
                    }))
                  }
                />
              ))}
            </div>
          </AccordionItem>
        )}
      </Accordion>

      <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
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
