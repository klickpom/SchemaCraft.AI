'use client';

import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANG_KEY, resolveUiLang, type UiLang } from '@/lib/uiLang';

type Ctx = {
  lang: UiLang | null;
  setLang: (next: UiLang) => void;
};

const UiLangContext = createContext<Ctx | null>(null);

function applyDocument(lang: UiLang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function UiLangProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState<UiLang | null>(null);

  useLayoutEffect(() => {
    const next = resolveUiLang(window.location.pathname);
    setLangState(next);
    applyDocument(next);
  }, []);

  useLayoutEffect(() => {
    if (lang !== null) document.documentElement.classList.remove('sc-lang-pending');
  }, [lang]);

  const setLang = useCallback((next: UiLang) => {
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* private mode */
    }
    setLangState(next);
    applyDocument(next);
    const bare = window.location.pathname.replace(/\/$/, '') || '/';
    const search = window.location.search + window.location.hash;
    if (next === 'ar' && bare === '/') router.replace(`/ar/${search}`);
    else if (next === 'en' && bare === '/ar') router.replace(`/${search}`);
  }, [router]);

  return <UiLangContext.Provider value={{ lang, setLang }}>{children}</UiLangContext.Provider>;
}

/** Page language comes from the route. A stored preference never restyles an English document. */
export function useUiLang(pageLang: UiLang = 'en'): UiLang {
  return pageLang;
}

export function useSetLang(): (next: UiLang) => void {
  const ctx = useContext(UiLangContext);
  return ctx?.setLang ?? (() => {});
}
