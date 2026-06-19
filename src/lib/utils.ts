import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PricePeriod, PropertyPurpose } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number,
  purpose: PropertyPurpose,
  pricePeriod?: PricePeriod | null,
): string {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(price)

  if (purpose === 'SALE') return formatted

  const periodLabels: Record<PricePeriod, string> = {
    DAY: 'يومياً',
    MONTH: 'شهرياً',
    YEAR: 'سنوياً',
  }

  return pricePeriod ? `${formatted} / ${periodLabels[pricePeriod]}` : formatted
}

export function buildQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function buildPropertiesQueryParams(
  filters: import('@/lib/types').PropertyFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit
  if (filters.city) params.city = filters.city
  if (filters.purpose) params.purpose = filters.purpose
  if (filters.pricePeriod) params.pricePeriod = filters.pricePeriod
  if (filters.parentCategoryId) params.parentCategoryId = filters.parentCategoryId
  if (filters.subcategoryId) params.subcategoryId = filters.subcategoryId
  if (filters.sort) params.sort = filters.sort

  if (filters.attributes) {
    Object.entries(filters.attributes).forEach(([slug, value]) => {
      if (value) params[`attributes[${slug}]`] = value
    })
  }

  return params
}

export function formatDateAr(date: string): string {
  return new Date(date).toLocaleDateString('ar-SA', { dateStyle: 'medium' })
}

export function formatAttributeValue(value: unknown, type: string): string {
  if (value === null || value === undefined || value === '') return '—'
  if (type === 'BOOLEAN') return value ? 'نعم' : 'لا'
  if (type === 'MULTI_SELECT' && Array.isArray(value)) return value.join('، ')
  if (type === 'DATE' && typeof value === 'string') return formatDateAr(value)
  return String(value)
}

export function buildPropertiesPageQuery(
  filters: import('@/lib/types').PropertyFilters,
  page: number,
): Record<string, string> {
  const query: Record<string, string> = { page: String(page) }
  if (filters.limit) query.limit = String(filters.limit)
  if (filters.city) query.city = filters.city
  if (filters.purpose) query.purpose = filters.purpose
  if (filters.pricePeriod) query.pricePeriod = filters.pricePeriod
  if (filters.parentCategoryId) query.parentCategoryId = filters.parentCategoryId
  if (filters.subcategoryId) query.subcategoryId = filters.subcategoryId
  if (filters.attributes) {
    Object.entries(filters.attributes).forEach(([slug, value]) => {
      if (value) query[`attributes[${slug}]`] = value
    })
  }
  return query
}

export function parseAttributeFiltersFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const attributes: Record<string, string> = {}

  Object.entries(params).forEach(([key, raw]) => {
    const match = key.match(/^attributes\[(.+)\]$/)
    if (!match) return
    const value = typeof raw === 'string' ? raw : raw?.[0]
    if (value) attributes[match[1]!] = value
  })

  return attributes
}

export function buildServicesQueryParams(
  filters: import('@/lib/types').ServiceProviderFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit
  if (filters.city) params.city = filters.city
  if (filters.area) params.area = filters.area
  if (filters.category) params.category = filters.category
  return params
}

export function buildServicesPageQuery(
  filters: import('@/lib/types').ServiceProviderFilters,
  page: number,
): Record<string, string> {
  const query: Record<string, string> = { page: String(page) }
  if (filters.limit) query.limit = String(filters.limit)
  if (filters.city) query.city = filters.city
  if (filters.area) query.area = filters.area
  if (filters.category) query.category = filters.category
  return query
}
