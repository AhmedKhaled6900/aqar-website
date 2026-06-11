import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(9, 'رقم الجوال غير صالح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4, 'رمز التحقق مطلوب'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
