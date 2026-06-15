'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ATTRIBUTE_TYPE_LABELS } from '@/constants/attributes'
import { formatAttributeValue } from '@/lib/utils'
import type {
  AttributeType,
  PropertyAttributesGroup,
  PropertyCustomAttribute,
  PropertySystemAttribute,
} from '@/lib/types'

interface PropertyAttributesDisplayProps {
  attributes?: PropertyAttributesGroup | null
}

type PropertyAttribute = PropertySystemAttribute | PropertyCustomAttribute

function isTruthyBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === 'true' || value === '1'
}

function shouldShowAttribute(type: AttributeType, value: unknown): boolean {
  if (type === 'BOOLEAN') return isTruthyBoolean(value)
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

function filterVisibleAttributes<T extends PropertyAttribute>(items: T[]): T[] {
  return items.filter((attr) => shouldShowAttribute(attr.type, attr.value))
}

function AttributeBooleanTags({ items }: { items: PropertyAttribute[] }) {
  const booleanItems = items.filter((attr) => attr.type === 'BOOLEAN')
  if (booleanItems.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {booleanItems.map((attr) => (
        <Badge
          key={attr.id}
          variant="secondary"
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800"
        >
          {attr.name}
        </Badge>
      ))}
    </div>
  )
}

function AttributeValueGrid({
  items,
  showTypeLabel,
}: {
  items: PropertyAttribute[]
  showTypeLabel?: boolean
}) {
  const valueItems = items.filter((attr) => attr.type !== 'BOOLEAN')
  if (valueItems.length === 0) return null

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {valueItems.map((attr) => (
        <div
          key={attr.id}
          className={
            showTypeLabel
              ? 'rounded-lg border border-primary/10 bg-primary-light/40 p-3'
              : 'rounded-lg border border-slate-100 bg-slate-50/50 p-3'
          }
        >
          <dt className="text-sm text-slate-500">
            {attr.name}
            {showTypeLabel && (
              <span className="mr-2 text-xs text-slate-400">
                ({ATTRIBUTE_TYPE_LABELS[attr.type]})
              </span>
            )}
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatAttributeValue(attr.value, attr.type)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function PropertyAttributesDisplay({
  attributes,
}: PropertyAttributesDisplayProps) {
  if (!attributes) return null

  const system = filterVisibleAttributes(attributes.system ?? [])
  const custom = filterVisibleAttributes(attributes.custom ?? [])

  if (system.length === 0 && custom.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">خصائص العقار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {system.length > 0 && (
          <div className="space-y-4">
            <AttributeBooleanTags items={system} />
            <AttributeValueGrid items={system} />
          </div>
        )}

        {custom.length > 0 && (
          <div className={system.length > 0 ? 'space-y-4 border-t border-slate-200 pt-5' : 'space-y-4'}>
            <p className="text-sm font-semibold text-primary">خصائص إضافية</p>
            <AttributeBooleanTags items={custom} />
            <AttributeValueGrid items={custom} showTypeLabel />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
