import { API_URL } from '@/lib/api/config'
import { normalizePaginatedResponse } from '@/lib/api/pagination'
import { normalizePublicServiceProvider } from '@/utils/services'
import { buildPropertiesQueryParams, buildQueryString, buildServicesQueryParams } from '@/lib/utils'
import type {
  PaginatedResponse,
  Property,
  PropertyFilters,
  PublicServiceProvider,
  Review,
  Comment,
  ServiceCategory,
  ServiceProviderFilters,
} from '@/lib/types'

async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function fetchProperties(
  filters: PropertyFilters = {},
): Promise<PaginatedResponse<Property>> {
  const query = buildPropertiesQueryParams(filters)
  const qs = new URLSearchParams(
    Object.entries(query).map(([k, v]) => [k, String(v)]),
  ).toString()
  const data = await serverFetch<PaginatedResponse<Property> | Property[]>(
    `/properties${qs ? `?${qs}` : ''}`,
  )
  return normalizePaginatedResponse<Property>(data)
}

export async function fetchProperty(id: string): Promise<Property> {
  return serverFetch<Property>(`/properties/${id}`)
}

export async function fetchSimilarProperties(
  id: string,
  page = 1,
  limit = 6,
): Promise<PaginatedResponse<Property>> {
  const data = await serverFetch<PaginatedResponse<Property> | Property[]>(
    `/properties/${id}/similar${buildQueryString({ page, limit })}`,
  )
  return normalizePaginatedResponse<Property>(data)
}

export async function fetchPropertyReviews(
  propertyId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<Review>> {
  const data = await serverFetch<PaginatedResponse<Review> | Review[]>(
    `/properties/${propertyId}/reviews${buildQueryString({ page, limit })}`,
  )
  return normalizePaginatedResponse<Review>(data)
}

export async function fetchPropertyComments(
  propertyId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedResponse<Comment>> {
  const data = await serverFetch<PaginatedResponse<Comment> | Comment[]>(
    `/properties/${propertyId}/comments${buildQueryString({ page, limit })}`,
  )
  return normalizePaginatedResponse<Comment>(data)
}

export async function fetchCategorySelectMenu() {
  return serverFetch<{ items: import('@/lib/types').CategorySelectMenuItem[] }>(
    '/categories/select-menu',
  )
}

export async function fetchServiceCategories(): Promise<{ items: ServiceCategory[] }> {
  return serverFetch<{ items: ServiceCategory[] }>('/services/categories')
}

export async function fetchPublicProviders(
  filters: ServiceProviderFilters = {},
): Promise<PaginatedResponse<PublicServiceProvider>> {
  const query = buildServicesQueryParams(filters)
  const qs = new URLSearchParams(
    Object.entries(query).map(([k, v]) => [k, String(v)]),
  ).toString()
  const data = await serverFetch<
    PaginatedResponse<PublicServiceProvider> | PublicServiceProvider[]
  >(`/services/providers${qs ? `?${qs}` : ''}`)
  return normalizePaginatedResponse<PublicServiceProvider>(data)
}

export async function fetchPublicProviderDetail(
  id: string,
): Promise<PublicServiceProvider> {
  const data = await serverFetch<PublicServiceProvider>(`/services/providers/${id}`)
  return normalizePublicServiceProvider(data)
}
