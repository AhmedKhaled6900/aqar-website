import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'المدونة',
}

const posts = [
  {
    id: '1',
    title: 'نصائح لشراء أول عقار',
    slug: 'first-property-tips',
    excerpt: 'دليل مبسط للمشترين الجدد في سوق العقارات السعودي.',
    publishedAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'كيف تختار حيّاً مناسباً للإيجار',
    slug: 'choose-rental-area',
    excerpt: 'معايير مهمة عند البحث عن شقة للإيجار.',
    publishedAt: '2026-02-01',
  },
]

export default function BlogPage() {
  return (
    <div className="container px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">المدونة</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">{post.publishedAt}</p>
                <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-slate-600">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
