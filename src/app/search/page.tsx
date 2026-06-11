import type { Metadata } from 'next'
import { SearchBar } from '@/components/search/search-bar'

export const metadata: Metadata = {
  title: 'البحث',
}

export default function SearchPage() {
  return (
    <div className="container px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">البحث</h1>
      <p className="mb-8 text-slate-600">
        بحث ذكي بالذكاء الاصطناعي — قريباً. استخدم البحث التقليدي أدناه.
      </p>
      <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-8 text-center text-emerald-800">
        AI Search — قريباً
      </div>
      <div className="mx-auto mt-8 max-w-4xl">
        <SearchBar />
      </div>
    </div>
  )
}
