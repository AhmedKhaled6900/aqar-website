'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const tAccount = useTranslations('account')
  const tCommon = useTranslations('common')
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <p className="text-slate-500">{tCommon('loading')}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAccount('profileTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">{tAccount('nameLabel')}</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">{tAccount('emailLabel')}</p>
          <p className="font-medium">{user.email ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">{tAccount('phoneLabel')}</p>
          <p className="font-medium">{user.phone ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">{tAccount('statusLabel')}</p>
          <Badge variant={user.isVerified ? 'default' : 'secondary'}>
            {user.isVerified ? tCommon('verified') : tCommon('notVerified')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
