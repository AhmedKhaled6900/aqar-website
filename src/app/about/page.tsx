import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على منصة عقار — منصة العقارات السعودية',
}

export default function AboutPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">من نحن</h1>
      <p className="mt-6 leading-relaxed text-slate-600">
        عقار منصة عقارية سعودية تهدف إلى تسهيل البحث عن العقارات للإيجار.
        نوفر تجربة بحث ذكية، عقارات معتمدة، وأدوات تفاعل للعملاء المسجلين.
      </p>
    </div>
  )
}
