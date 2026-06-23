import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { BrandLogo } from '@/components/layout/brand-logo'
import { APP_NAME } from '@/constants/branding'

export async function Footer() {
  const t = await getTranslations()

  const links = [
    { href: '/about', label: t('footer.about') },
    { href: '/contact', label: t('footer.contact') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
    { href: '/faq', label: t('footer.faq') },
  ] as const

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandLogo asLink={false} className="items-start" />
            <p className="mt-2 text-sm text-slate-600">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{t('footer.quickLinks')}</h4>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{t('footer.downloadApp')}</h4>
            <p className="mt-2 text-sm text-slate-600">{t('footer.downloadSoon')}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {APP_NAME}. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  )
}
