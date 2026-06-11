import { PropertyGridSkeleton } from '@/components/common/skeletons'

export default function PropertiesLoading() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <PropertyGridSkeleton count={9} />
    </div>
  )
}
