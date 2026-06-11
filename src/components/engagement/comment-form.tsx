'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateComment } from '@/features/comments/useComments'
import { commentSchema, type CommentInput } from '@/schemas/property'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'

interface CommentFormProps {
  propertyId: string
}

export function CommentForm({ propertyId }: CommentFormProps) {
  const user = useAuthStore((s) => s.user)
  const createComment = useCreateComment(propertyId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
  })

  if (!user) {
    return (
      <p className="text-sm text-slate-500">
        <Link href="/auth/login" className="text-emerald-600 hover:underline">
          سجّل الدخول
        </Link>{' '}
        لإضافة تعليق
      </p>
    )
  }

  async function onSubmit(data: CommentInput) {
    await createComment.mutateAsync(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Textarea placeholder="اكتب تعليقك..." {...register('content')} />
      {errors.content && (
        <p className="text-sm text-red-600">{errors.content.message}</p>
      )}
      <Button type="submit" disabled={createComment.isPending} size="sm">
        {createComment.isPending ? 'جاري الإرسال...' : 'إرسال'}
      </Button>
    </form>
  )
}
