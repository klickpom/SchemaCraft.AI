export const LANG_KEY = 'sc-lang';

export type UiLang = 'en' | 'ar';

/** Preference wins, except the Arabic homepage URL which is Arabic on purpose. */
export function resolveUiLang(pathname: string, stored: string | null): UiLang {
  const bare = pathname.replace(/\/$/, '') || '/';
  if (bare === '/ar' || bare.startsWith('/ar/')) return 'ar';
  if (stored === 'ar' || stored === 'en') return stored;
  return 'en';
}
