import { z } from 'zod'

export const serviceOrderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z
    .number({ error: 'الكمية مطلوبة' })
    .int('الكمية يجب أن تكون رقماً صحيحاً')
    .positive('الكمية يجب أن تكون أكبر من صفر'),
  unitPrice: z
    .number({ error: 'السعر مطلوب' })
    .positive('السعر يجب أن يكون موجباً'),
  notes: z.string().optional(),
})

export const createServiceOrderSchema = z.object({
  listingId: z.string().min(1, 'المنيو مطلوب'),
  items: z.array(serviceOrderItemSchema).min(1, 'اختر عنصراً واحداً على الأقل'),
  deliveryCity: z.string().min(1, 'المدينة مطلوبة'),
  deliveryArea: z.string().min(1, 'المنطقة مطلوبة'),
  deliveryAddress: z.string().min(3, 'عنوان التوصيل مطلوب'),
  deliveryFee: z
    .number({ error: 'رسوم التوصيل مطلوبة' })
    .min(0, 'رسوم التوصيل لا يمكن أن تكون سالبة'),
  notes: z.string().optional(),
})

export type CreateServiceOrderFormInput = z.infer<typeof createServiceOrderSchema>

export interface ServiceOrderCartLine {
  listingId: string
  name: string
  unitPrice: number
  quantity: number
}
