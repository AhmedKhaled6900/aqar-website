'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <p className="text-slate-500">جاري التحميل...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">الاسم</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">البريد الإلكتروني</p>
          <p className="font-medium">{user.email ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">رقم الجوال</p>
          <p className="font-medium">{user.phone ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">الحالة</p>
          <Badge variant={user.isVerified ? 'default' : 'secondary'}>
            {user.isVerified ? 'مفعّل' : 'غير مفعّل'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
