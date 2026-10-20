export const LANG_KEY = 'sc-lang';

export type UiLang = 'en' | 'ar';

/** The URL is the language. /ar and /ar/* are Arabic. Every other path is English. */
export function resolveUiLang(pathname: string, _stored: string | null = null): UiLang {
  const bare = pathname.replace(/\/$/, '') || '/';
  if (bare === '/ar' || bare.startsWith('/ar/')) return 'ar';
  return 'en';
}
