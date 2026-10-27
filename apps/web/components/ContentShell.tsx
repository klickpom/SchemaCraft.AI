'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { withLang } from '@/lib/i18n/path';
import type { RelatedLink } from '@/lib/content/related';

export type { RelatedLink };

export interface ContentShellProps {
  lang?: 'en' | 'ar';
  crumb: string;
  eyebrow: string;
  title: string;
  lead: React.ReactNode;
  updated: string;
  tool?: React.ReactNode;
  children: React.ReactNode;
  faq?: { q: string; a: string }[];
  related?: RelatedLink[];
}

const PROSE =
  'space-y-5 text-[15px] text-slate-300 leading-relaxed [&_h2]:text-white [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_h3]:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-1.5 [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:space-y-1.5 [&_a]:text-cyan-300 [&_a]:underline [&_a]:underline-offset-2 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-cyan-200 [&_code]:bg-white/[0.06] [&_code]:px-1 [&_code]:rounded [&_pre]:bg-black/60 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-[12.5px] [&_pre]:leading-relaxed [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:text-white [&_table]:w-full [&_table]:text-[13px] [&_th]:text-start [&_th]:text-slate-400 [&_th]:font-semibold [&_th]:py-2 [&_th]:pe-3 [&_td]:py-2 [&_td]:pe-3 [&_td]:align-top [&_tr]:border-t [&_tr]:border-white/5';

export function ContentShell({ lang = 'en', crumb, eyebrow, title, lead, updated, tool, children, faq, related }: ContentShellProps) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const home = withLang('/', lang);
  const authoredDir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <SiteChrome lang={lang}>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-10 sm:space-y-14">
        <nav aria-label={t('Breadcrumb', 'مسار التنقل')} className="text-xs text-slate-400">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href={home} className="hover:text-cyan-300">SchemaCraft</Link></li>
            <li aria-hidden><ChevronRight className="w-3 h-3 rtl:rotate-180" /></li>
            <li aria-current="page" className="text-slate-200">{crumb}</li>
          </ol>
        </nav>

        <header className="max-w-3xl space-y-4" dir={authoredDir} lang={lang}>
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-[11px] font-semibold text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">{title}</h1>
          <div className="text-base sm:text-lg text-slate-300 leading-relaxed">{lead}</div>
          <p className="text-xs text-slate-500">
            {t('Updated', 'آخر تحديث')} <time dateTime={updated}>{updated}</time>
          </p>
        </header>

        {tool && <section aria-label={t('Tool', 'الأداة')}>{tool}</section>}

        <article className={`max-w-3xl ${PROSE}`} dir={authoredDir} lang={lang}>{children}</article>

        {faq && faq.length > 0 && (
          <section className="max-w-3xl space-y-4" aria-labelledby="faq" dir={authoredDir} lang={lang}>
            <h2 id="faq" className="text-xl sm:text-2xl font-black text-white tracking-tight">{t('Frequently asked questions', 'الأسئلة الشائعة')}</h2>
            <div className="space-y-2.5">
              {faq.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-white/10 bg-black/40 open:border-indigo-500/40 open:bg-indigo-950/20">
                  <summary className="cursor-pointer list-none p-4 sm:p-5 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-white">{item.q}</h3>
                    <span className="text-slate-400 group-open:rotate-45 transition text-lg leading-none" aria-hidden>+</span>
                  </summary>
                  <p className="px-4 sm:px-5 pb-5 text-sm text-slate-300 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {related && related.length > 0 && (
          <section className="space-y-4" aria-labelledby="related">
            <h2 id="related" className="text-lg font-black text-white">{t('Related free tools', 'أدوات مجانية ذات صلة')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link key={r.href} href={withLang(r.href, lang)} className="group p-4 rounded-2xl border border-white/10 bg-[#0c0c14] hover:border-indigo-500/40 transition space-y-1.5">
                  <span className="flex items-center justify-between text-sm font-bold text-white group-hover:text-cyan-300">
                    {lang === 'ar' && r.titleAr ? r.titleAr : r.title}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
                  </span>
                  <span className="block text-[13px] text-slate-400 leading-relaxed">{lang === 'ar' && r.descAr ? r.descAr : r.desc}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </SiteChrome>
  );
}

