import type { PropertyPurpose } from '@/lib/types'

/**
 * Sale listings are disabled until the sale module ships.
 * Set to `true` to re-enable sale UI, filters, and property pages.
 */
export const SALE_ENABLED = false

export const DEFAULT_PROPERTY_PURPOSE: PropertyPurpose = 'RENT'

export function resolvePropertyPurposeFilter(
  purpose?: string | null,
): PropertyPurpose | undefined {
  if (!SALE_ENABLED) return DEFAULT_PROPERTY_PURPOSE
  if (purpose === 'SALE' || purpose === 'RENT') return purpose
  return undefined
}

export function isPropertyPurposeVisible(purpose: PropertyPurpose): boolean {
  return SALE_ENABLED || purpose === 'RENT'
}
