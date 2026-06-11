import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'اتصل بنا',
}

export default function ContactPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">اتصل بنا</h1>
      <p className="mt-6 text-slate-600">
        للاستفسارات والدعم: support@aqar.sa
      </p>
    </div>
  )
}
