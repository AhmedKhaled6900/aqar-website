import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AppProviders } from '@/providers/app-providers'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'عقار — منصة العقارات السعودية',
    template: '%s | عقار',
  },
  description:
    'ابحث عن عقارات للبيع والإيجار في السعودية. شقق، فلل، أراضي وأكثر.',
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}
