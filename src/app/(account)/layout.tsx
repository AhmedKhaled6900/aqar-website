import { AccountSidebar } from '@/components/layout/account-sidebar'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">حسابي</h1>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  )
}
