import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { AuthCallbackHandler } from '@/components/auth/auth-callback-handler'

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  )
}
