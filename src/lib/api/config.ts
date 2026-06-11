export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'https://nestjs-production-5e25.up.railway.app'

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL?.replace(/\/$/, '') ??
  'http://localhost:5173'
