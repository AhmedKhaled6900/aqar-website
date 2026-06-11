import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
