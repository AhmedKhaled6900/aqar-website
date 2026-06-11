import { setTokens, storePermissions } from '@/lib/auth/tokens'
import type { AuthResponse } from '@/lib/types'

export function persistAuthResponse(data: AuthResponse) {
  setTokens(data.accessToken, data.refreshToken)
  storePermissions(data.permissions)
}
