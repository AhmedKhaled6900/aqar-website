'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateReview } from '@/features/reviews/useReviews'
import { reviewSchema, type ReviewInput } from '@/schemas/property'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

interface ReviewFormProps {
  propertyId: string
}

export function ReviewForm({ propertyId }: ReviewFormProps) {
  const user = useAuthStore((s) => s.user)
  const createReview = useCreateReview(propertyId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  })

  if (!user) {
    return (
      <p className="text-sm text-slate-500">
        <Link href="/auth/login" className="text-primary hover:underline">
          سجّل الدخول
        </Link>{' '}
        لإضافة تقييم
      </p>
    )
  }

  async function onSubmit(data: ReviewInput) {
    await createReview.mutateAsync(data)
    reset({ rating: 5, content: '' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold">أضف تقييمك</h3>
      <div className="space-y-2">
        <Label htmlFor="rating">التقييم (1-5)</Label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          className="flex h-10 w-full rounded-lg border border-slate-200 px-3"
          {...register('rating', { valueAsNumber: true })}
        />
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">التعليق</Label>
        <Textarea id="content" {...register('content')} />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" disabled={createReview.isPending}>
        {createReview.isPending ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </Button>
    </form>
  )
}
