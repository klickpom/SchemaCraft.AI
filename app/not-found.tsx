'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteChrome } from '@/components/SiteChrome';
import { RELATED } from '@/lib/content/related';
import { withLang } from '@/lib/i18n/path';
import type { UiLang } from '@/lib/uiLang';

export default function NotFound() {
  const pathname = usePathname() || '/';
  const lang: UiLang = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
  const links = [RELATED.audit, RELATED.crawlerChecker, RELATED.robots, RELATED.validator, RELATED.generators, RELATED.crawlers];
  return (
    <SiteChrome lang={lang}>
      <main dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-8 text-center">
        <p className="text-sm font-mono text-cyan-300">404</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {lang === 'ar' ? 'هذه الصفحة غير موجودة' : 'This page doesn’t exist'}
        </h1>
        <p className="text-slate-400">
          {lang === 'ar' ? 'الرابط قديم أو فيه خطأ. هذه الصفحات التي يبحث عنها معظم الناس:' : 'The link may be old or mistyped. These are the pages most people are looking for:'}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={withLang(l.href, lang)} className="block p-4 rounded-2xl border border-white/10 bg-[#0c0c14] hover:border-indigo-500/40 transition">
                <span className="block text-sm font-bold text-white">{lang === 'ar' ? l.titleAr : l.title}</span>
                <span className="block text-[13px] text-slate-400">{lang === 'ar' ? l.descAr : l.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteChrome>
  );
}
