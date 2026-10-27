export type Lang = 'en' | 'ar';

export const L = (lang: Lang, en: string, ar: string) => (lang === 'ar' ? ar : en);

/** "1 issue" / "3 issues" and Arabic dual/plural forms. */
export function count(lang: Lang, n: number, en: [string, string], ar: [string, string, string, string]): string {
  if (lang === 'en') return `${n} ${n === 1 ? en[0] : en[1]}`;
  const [one, two, few, many] = ar;
  if (n === 0) return `0 ${many}`;
  if (n === 1) return one;
  if (n === 2) return two;
  if (n <= 10) return `${n} ${few}`;
  return `${n} ${many}`;
}

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function scoreTone(score: number | null) {
  if (score === null) return { text: 'text-slate-400', bar: 'bg-slate-600', ring: 'stroke-slate-500', chip: 'text-slate-300 border-white/15 bg-white/5', glow: 'bg-slate-500' };
  if (score >= 80) return { text: 'text-emerald-400', bar: 'bg-emerald-400', ring: 'stroke-emerald-400', chip: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10', glow: 'bg-emerald-500' };
  if (score >= 50) return { text: 'text-amber-400', bar: 'bg-amber-400', ring: 'stroke-amber-400', chip: 'text-amber-300 border-amber-500/40 bg-amber-500/10', glow: 'bg-amber-500' };
  return { text: 'text-rose-400', bar: 'bg-rose-400', ring: 'stroke-rose-400', chip: 'text-rose-300 border-rose-500/40 bg-rose-500/10', glow: 'bg-rose-500' };
}
