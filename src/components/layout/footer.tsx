import Link from 'next/link'

const links = [
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/terms', label: 'الشروط والأحكام' },
  { href: '/faq', label: 'الأسئلة الشائعة' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-emerald-700">عقار</h3>
            <p className="mt-2 text-sm text-slate-600">
              منصة عقارية سعودية للبحث عن العقارات للبيع والإيجار بثقة وأمان.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">روابط سريعة</h4>
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">حمّل التطبيق</h4>
            <p className="mt-2 text-sm text-slate-600">
              قريباً على App Store و Google Play
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} عقار. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
