'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AttributeType, SubcategoryAttributeItem } from '@/lib/types'

interface AttributeFilterFieldProps {
  attribute: SubcategoryAttributeItem
  value: string
  onChange: (value: string) => void
}

export function AttributeFilterField({
  attribute,
  value,
  onChange,
}: AttributeFilterFieldProps) {
  const fieldId = `filter-attr-${attribute.slug}`

  switch (attribute.type as AttributeType) {
    case 'BOOLEAN':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{attribute.name}</Label>
          <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? '' : v)}>
            <SelectTrigger id={fieldId}>
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="true">نعم</SelectItem>
              <SelectItem value="false">لا</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case 'NUMBER':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{attribute.name}</Label>
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="أي قيمة"
          />
        </div>
      )

    case 'SELECT':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{attribute.name}</Label>
          <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? '' : v)}>
            <SelectTrigger id={fieldId}>
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {(attribute.options ?? []).map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case 'MULTI_SELECT': {
      const selected = value ? value.split(',') : []
      return (
        <div className="space-y-2">
          <Label>{attribute.name}</Label>
          <div className="space-y-2 rounded-lg border border-slate-200 p-3">
            {(attribute.options ?? []).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, opt]
                      : selected.filter((x) => x !== opt)
                    onChange(next.join(','))
                  }}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )
    }

    case 'DATE':
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{attribute.name}</Label>
          <Input
            id={fieldId}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{attribute.name}</Label>
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="بحث..."
          />
        </div>
      )
  }
}
