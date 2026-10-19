'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function SiteChrome({ children, lang = 'en', onToggleLang }: { children: React.ReactNode; lang?: 'en' | 'ar'; onToggleLang?: () => void }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <div className="relative min-h-screen bg-[#08080f] text-zinc-100 flex flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_70%)]" />
      </div>
      <Header lang={lang} onToggleLang={onToggleLang} />
      <div className="relative z-10 flex-1">{children}</div>
      <Footer lang={lang} />
    </div>
  );
}
