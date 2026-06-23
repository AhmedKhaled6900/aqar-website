'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVerifyEmail } from '@/features/auth/useVerifyEmail'
import { verifyEmailSchema, type VerifyEmailInput } from '@/schemas/auth'
import { useAuthStore } from '@/store/auth-store'

export function VerifyEmailForm() {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') ?? ''
  const verifyEmail = useVerifyEmail()
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailParam },
  })

  async function onSubmit(data: VerifyEmailInput) {
    try {
      const result = await verifyEmail.mutateAsync(data)
      setSession(result.user, result.permissions)
      router.push('/')
    } catch {
      // toast handled globally
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('verifyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">{t('code')}</Label>
              <Input id="code" {...register('code')} />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={verifyEmail.isPending}>
              {verifyEmail.isPending ? t('verifying') : t('verifyBtn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
