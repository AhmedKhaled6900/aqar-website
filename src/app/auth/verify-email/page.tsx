import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { VerifyEmailForm } from '@/components/auth/verify-email-form'

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  )
}
