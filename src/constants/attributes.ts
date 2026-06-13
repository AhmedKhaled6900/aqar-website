import type { AttributeType } from '@/lib/types'

export const ATTRIBUTE_TYPE_LABELS: Record<AttributeType, string> = {
  TEXT: 'نص',
  NUMBER: 'رقم',
  BOOLEAN: 'نعم/لا',
  SELECT: 'قائمة',
  MULTI_SELECT: 'اختيار متعدد',
  DATE: 'تاريخ',
}
