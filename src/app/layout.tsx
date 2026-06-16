import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AppProviders } from '@/providers/app-providers'
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/branding'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cairo.className} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <AppProviders>
          <Header />
          <main className="flex-1 animate-fade-in">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}
