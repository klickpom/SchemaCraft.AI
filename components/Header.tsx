'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { schemaPath } from '@/lib/seo/urls';

interface HeaderProps {
  lang?: 'en' | 'ar';
  onToggleLang?: () => void;
}

const TOOLS = [
  { href: '/ai-crawler-checker/', en: 'AI crawler checker', ar: 'فاحص زواحف الذكاء الاصطناعي' },
  { href: '/robots-txt-generator/', en: 'robots.txt generator', ar: 'مولد robots.txt' },
  { href: '/llms-txt-generator/', en: 'llms.txt generator', ar: 'مولد llms.txt' },
  { href: '/schema-validator/', en: 'Schema validator', ar: 'مدقق السكيما' },
  { href: '/json-ld-generator/', en: 'JSON-LD generator', ar: 'مولد JSON-LD' },
];

const GUIDES = [
  { href: '/should-i-block-gptbot/', en: 'Should you block GPTBot?', ar: 'هل تمنع GPTBot؟' },
  { href: '/chatgpt-search/', en: 'Show up in ChatGPT Search', ar: 'الظهور في بحث ChatGPT' },
  { href: '/ai-crawlers/', en: 'AI crawler list (user-agents)', ar: 'قائمة زواحف الذكاء الاصطناعي' },
  { href: '/geo-vs-aeo/', en: 'GEO vs AEO vs SEO', ar: 'GEO وAEO وSEO' },
  { href: schemaPath('local-seo-schema'), en: 'Local business schema', ar: 'سكيما النشاط المحلي' },
  { href: schemaPath('shopify-product'), en: 'Shopify product schema', ar: 'سكيما منتجات شوبيفاي' },
];

export function Header({ lang = 'en', onToggleLang }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<'tools' | 'guides' | null>(null);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  const dropdown = (id: 'tools' | 'guides', label: string, items: typeof TOOLS) => (
    <div className="relative" onMouseLeave={() => setMenu(null)}>
      <button
        type="button"
        onClick={() => setMenu(menu === id ? null : id)}
        onMouseEnter={() => setMenu(id)}
        className="flex items-center gap-1 hover:text-cyan-300 transition-colors py-2"
        aria-expanded={menu === id}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menu === id ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute top-full start-0 w-64 rounded-2xl border border-white/15 bg-[#0e0e18] shadow-2xl p-2 transition-all ${menu === id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenu(null)} className="block px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white">
            {t(item.en, item.ar)}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08080f]/90 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        <Link href={lang === 'ar' ? '/ar/' : '/'} className="flex items-center gap-2 shrink-0" aria-label="SchemaCraft AI home">
          <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl overflow-hidden border border-indigo-400/30 bg-[#09090b]">
            <img src="/logo.png" alt="" width={36} height={36} className="h-full w-full object-cover" />
          </span>
          <span className="font-black tracking-tight text-white text-sm sm:text-base">
            SchemaCraft<span className="text-indigo-400">.AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300" aria-label={t('Main', 'الرئيسية')}>
          <Link href={lang === 'ar' ? '/ar/' : '/'} className="hover:text-cyan-300">{t('Free audit', 'الفحص المجاني')}</Link>
          <Link href="/ai-crawler-checker/" className="hover:text-cyan-300">{t('AI crawler checker', 'فاحص زواحف AI')}</Link>
          {dropdown('tools', t('Free tools', 'أدوات مجانية'), TOOLS)}
          {dropdown('guides', t('Guides', 'أدلة'), GUIDES)}
          <Link href="/about/" className="hover:text-cyan-300">{t('Methodology', 'المنهجية')}</Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onToggleLang ? (
            <button type="button" onClick={onToggleLang} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200" aria-label={t('Switch to Arabic', 'التبديل إلى الإنجليزية')}>
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> {lang === 'en' ? 'عربي' : 'EN'}
            </button>
          ) : (
            <Link href={lang === 'ar' ? '/' : '/ar/'} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200" hrefLang={lang === 'ar' ? 'en' : 'ar'}>
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> {lang === 'en' ? 'عربي' : 'EN'}
            </Link>
          )}
          <Link href={lang === 'ar' ? '/ar/#audit' : '/#audit'} className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg font-black text-xs bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white hover:opacity-95">
            {t('Run free audit', 'افحص موقعك مجاناً')}
          </Link>
          <button type="button" onClick={() => setOpen(!open)} className="lg:hidden p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300" aria-label={t('Menu', 'القائمة')} aria-expanded={open}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/10 bg-[#0c0c16] px-4 py-4 space-y-1" aria-label={t('Mobile', 'الجوال')}>
          {[{ href: lang === 'ar' ? '/ar/' : '/', en: 'Free audit', ar: 'الفحص المجاني' }, ...TOOLS, ...GUIDES, { href: '/about/', en: 'Methodology', ar: 'المنهجية' }].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-white/[0.06] text-sm text-white">
              {t(item.en, item.ar)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
