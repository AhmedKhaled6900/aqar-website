import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
}

const faqs = [
  {
    q: 'هل أحتاج حساب لتصفح العقارات؟',
    a: 'لا، يمكنك تصفح العقارات بدون تسجيل. التسجيل مطلوب للمفضلة والتعليقات والعروض.',
  },
  {
    q: 'كيف أقدّم عرض سعر؟',
    a: 'من صفحة تفاصيل العقار، إذا كان العقار قابلاً للتفاوض، يمكنك تقديم عرض سعر بعد تسجيل الدخول.',
  },
]

export default function FaqPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">الأسئلة الشائعة</h1>
      <div className="mt-8 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">{faq.q}</h2>
            <p className="mt-2 text-slate-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
