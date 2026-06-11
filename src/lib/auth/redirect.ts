import { DASHBOARD_URL } from '@/lib/api/config'
import type { User } from '@/lib/types'

export function getPostLoginPath(user: User): string {
  if (!user.isVerified) {
    return '/auth/verify-email'
  }

  if (user.role === 'OWNER' || user.role === 'ADMIN') {
    return DASHBOARD_URL
  }

  return '/'
}

export function getDashboardUrlForRole(role: User['role']): string | null {
  if (role === 'OWNER' || role === 'ADMIN') {
    return DASHBOARD_URL
  }
  return null
}
