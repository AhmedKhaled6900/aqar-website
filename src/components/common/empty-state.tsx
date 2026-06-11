import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="h-8 w-8 text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
