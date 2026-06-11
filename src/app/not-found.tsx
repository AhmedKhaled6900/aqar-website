import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">
        الصفحة غير موجودة
      </h2>
      <p className="mt-2 max-w-md text-slate-600">
        عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">العودة للرئيسية</Link>
      </Button>
    </div>
  )
}
