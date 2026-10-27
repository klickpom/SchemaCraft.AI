'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { swapLang } from '@/lib/i18n/path';
import { LANG_KEY, type UiLang } from '@/lib/uiLang';

export function LangToggle({ lang }: { lang: UiLang }) {
  const pathname = usePathname() || (lang === 'ar' ? '/ar/' : '/');
  const href = swapLang(pathname);
  const next: UiLang = lang === 'ar' ? 'en' : 'ar';
  return (
    <a
      href={href}
      hrefLang={next}
      onClick={() => {
        try {
          localStorage.setItem(LANG_KEY, next);
        } catch {
          /* private mode */
        }
      }}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200"
    >
      <Globe className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
      {lang === 'en' ? 'عربي' : 'EN'}
    </a>
  );
}
