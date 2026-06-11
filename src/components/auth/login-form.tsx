'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/features/auth/useLogin'
import { loginSchema, type LoginInput } from '@/schemas/auth'
import { getPostLoginPath } from '@/lib/auth/redirect'
import { API_URL } from '@/lib/api/config'
import { useAuthStore } from '@/store/auth-store'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const login = useLogin()
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    try {
      const result = await login.mutateAsync(data)
      setSession(result.user, result.permissions)
      const path = getPostLoginPath(result.user)
      if (path.startsWith('http')) {
        window.location.href = path
      } else {
        router.push(redirect !== '/' ? redirect : path)
      }
    } catch {
      // toast handled globally
    }
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'جاري الدخول...' : 'دخول'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/auth/forgot-password" className="text-emerald-600 hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button asChild variant="outline" className="mt-4 w-full">
            <a href={`${API_URL}/auth/google`}>تسجيل الدخول بـ Google</a>
          </Button>

          <p className="mt-4 text-center text-sm text-slate-600">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-emerald-600 hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
