import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const PERMISSIONS_KEY = 'permissions'

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function getPermissions(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function storePermissions(permissions: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions))
}

export function setTokens(accessToken: string, refreshToken: string) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 })
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 })
}

export function clearAuthStorage() {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PERMISSIONS_KEY)
  }
}

export function hasPermission(permission: string): boolean {
  return getPermissions().includes(permission)
}
