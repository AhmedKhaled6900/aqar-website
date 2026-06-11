'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">حدث خطأ غير متوقع</h2>
      <p className="mt-2 text-slate-600">يرجى المحاولة مرة أخرى.</p>
      <Button onClick={reset} className="mt-6">
        إعادة المحاولة
      </Button>
    </div>
  )
}
