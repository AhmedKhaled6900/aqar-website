import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(3, 'التعليق قصير جداً'),
})

export const commentSchema = z.object({
  content: z.string().min(2, 'التعليق مطلوب'),
})

const pricePeriodEnum = z.enum(['DAY', 'MONTH', 'YEAR'], {
  error: 'فترة السعر مطلوبة',
})

export const offerSchema = z.object({
  price: z.number({ error: 'السعر مطلوب' }).positive('السعر يجب أن يكون موجباً'),
  pricePeriod: pricePeriodEnum,
  duration: z
    .number({ error: 'المدة مطلوبة' })
    .int('المدة يجب أن تكون رقماً صحيحاً')
    .positive('المدة يجب أن تكون أكبر من صفر'),
  notes: z.string().optional(),
})

export const bookingSchema = z.object({
  duration: z
    .number({ error: 'المدة مطلوبة' })
    .int('المدة يجب أن تكون رقماً صحيحاً')
    .positive('المدة يجب أن تكون أكبر من صفر'),
  pricePeriod: pricePeriodEnum,
  notes: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type OfferInput = z.infer<typeof offerSchema>
export type BookingInput = z.infer<typeof bookingSchema>
