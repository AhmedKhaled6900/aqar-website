export const PUBLIC_ROUTES = [
  '/',
  '/properties',
  '/services',
  '/categories',
  '/auth',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/faq',
  '/search',
] as const

export const ACCOUNT_ROUTES = [
  '/account/favorites',
  '/account/cart',
  '/account/offers',
  '/account/reviews',
  '/account/comments',
  '/account/bookings',
  '/account/service-orders',
  '/account/profile',
  '/account/notifications',
  '/account/messages',
  '/account/visits',
  '/account/saved-searches',
] as const

export const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/callback',
] as const
