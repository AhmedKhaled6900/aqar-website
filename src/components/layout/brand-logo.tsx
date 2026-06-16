import Link from 'next/link'
import { APP_NAME_PRIMARY, APP_NAME_SECONDARY } from '@/constants/branding'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  primaryClassName?: string
  secondaryClassName?: string
  asLink?: boolean
}

export function BrandLogo({
  className,
  primaryClassName,
  secondaryClassName,
  asLink = true,
}: BrandLogoProps) {
  const content = (
    <span className={cn('inline-flex flex-col leading-tight', className)}>
      <span
        className={cn(
          'text-xl font-bold text-primary transition-colors group-hover:text-primary-dark',
          primaryClassName,
        )}
      >
        {APP_NAME_PRIMARY}
      </span>
      <span
        className={cn('text-xs font-medium text-slate-500', secondaryClassName)}
      >
        {APP_NAME_SECONDARY}
      </span>
    </span>
  )

  if (!asLink) return content

  return (
    <Link href="/" className="group">
      {content}
    </Link>
  )
}
