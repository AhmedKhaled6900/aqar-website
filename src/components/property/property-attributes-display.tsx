'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ATTRIBUTE_TYPE_LABELS } from '@/constants/attributes'
import { formatAttributeValue } from '@/lib/utils'
import type { PropertyAttributesGroup } from '@/lib/types'

interface PropertyAttributesDisplayProps {
  attributes?: PropertyAttributesGroup | null
}

export function PropertyAttributesDisplay({
  attributes,
}: PropertyAttributesDisplayProps) {
  if (!attributes) return null

  const system = attributes.system ?? []
  const custom = attributes.custom ?? []

  if (system.length === 0 && custom.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">خصائص العقار</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {system.length > 0 && (
          <dl className="grid gap-4 sm:grid-cols-2">
            {system.map((attr) => (
              <div
                key={attr.id}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
              >
                <dt className="text-sm text-slate-500">{attr.name}</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {formatAttributeValue(attr.value, attr.type)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {custom.length > 0 && (
          <div className={system.length > 0 ? 'border-t border-slate-200 pt-5' : ''}>
            <p className="mb-3 text-sm font-semibold text-primary">خصائص إضافية</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              {custom.map((attr) => (
                <div
                  key={attr.id}
                  className="rounded-lg border border-primary/10 bg-primary-light/40 p-3"
                >
                  <dt className="text-sm text-slate-600">
                    {attr.name}
                    <span className="mr-2 text-xs text-slate-400">
                      ({ATTRIBUTE_TYPE_LABELS[attr.type]})
                    </span>
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {formatAttributeValue(attr.value, attr.type)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
