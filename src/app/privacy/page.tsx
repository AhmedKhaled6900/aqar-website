import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">سياسة الخصوصية</h1>
      <p className="mt-6 text-slate-600">سياسة الخصوصية — محتوى قريباً.</p>
    </div>
  )
}
