import { z } from 'zod'

export const serviceOrderDeliverySchema = z.object({
  deliveryCity: z.string().min(1, 'المدينة مطلوبة'),
  deliveryArea: z.string().min(1, 'المنطقة مطلوبة'),
  deliveryAddress: z.string().min(3, 'عنوان التوصيل مطلوب'),
  notes: z.string().optional(),
})

export const createServiceOrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z
    .number({ error: 'الكمية مطلوبة' })
    .int('الكمية يجب أن تكون رقماً صحيحاً')
    .positive('الكمية يجب أن تكون أكبر من صفر'),
  notes: z.string().optional(),
})

export const createServiceOrderSchema = z.object({
  providerId: z.string().min(1, 'مزود الخدمة مطلوب'),
  listingId: z.string().min(1, 'الإعلان مطلوب'),
  items: z.array(createServiceOrderItemSchema).min(1, 'اختر عنصراً واحداً على الأقل'),
  deliveryCity: z.string().min(1, 'المدينة مطلوبة'),
  deliveryArea: z.string().min(1, 'المنطقة مطلوبة'),
  deliveryAddress: z.string().min(3, 'عنوان التوصيل مطلوب'),
  notes: z.string().optional(),
})

export type ServiceOrderDeliveryInput = z.infer<typeof serviceOrderDeliverySchema>
export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>

export interface ServiceOrderCartLine {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  notes?: string
}
