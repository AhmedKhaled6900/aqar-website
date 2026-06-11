import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { fetchCategorySelectMenu } from '@/lib/api/server'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: `تصنيف: ${slug}` }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchCategorySelectMenu().catch(() => ({ items: [] }))
  const category = data.items.find((c) => c.slug === slug)

  if (category) {
    redirect(`/properties?parentCategoryId=${category.id}`)
  }

  redirect('/properties')
}
