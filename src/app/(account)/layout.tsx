import { getTranslations } from 'next-intl/server'
import { AccountSidebar } from '@/components/layout/account-sidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('account')

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{t('title')}</h1>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  )
}
