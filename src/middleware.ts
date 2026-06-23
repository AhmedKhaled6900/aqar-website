import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACCOUNT_PREFIX = '/account'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith(ACCOUNT_PREFIX)) {
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
