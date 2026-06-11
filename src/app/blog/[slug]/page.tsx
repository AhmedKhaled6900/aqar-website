import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const posts: Record<string, { title: string; content: string }> = {
  'first-property-tips': {
    title: 'نصائح لشراء أول عقار',
    content: 'محتوى المقال — placeholder للمدونة.',
  },
  'choose-rental-area': {
    title: 'كيف تختار حيّاً مناسباً للإيجار',
    content: 'محتوى المقال — placeholder للمدونة.',
  },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return { title: 'المدونة' }
  return { title: post.title, description: post.content.slice(0, 160) }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) notFound()

  return (
    <article className="container max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
      <p className="mt-6 leading-relaxed text-slate-600">{post.content}</p>
    </article>
  )
}
