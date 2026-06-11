'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForgotPassword } from '@/features/auth/useForgotPassword'
import { forgotPasswordSchema } from '@/schemas/auth'
import { z } from 'zod'

type ForgotInput = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotInput) {
    try {
      await forgotPassword.mutateAsync(data.email)
    } catch {
      // toast handled globally
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">استعادة كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitSuccessful ? (
            <p className="text-center text-sm text-primary">
              تم إرسال رمز الاستعادة إلى بريدك الإلكتروني.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
                {forgotPassword.isPending ? 'جاري الإرسال...' : 'إرسال'}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
