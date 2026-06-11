import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
}

export default function TermsPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">الشروط والأحكام</h1>
      <p className="mt-6 text-slate-600">الشروط والأحكام — محتوى قريباً.</p>
    </div>
  )
}
