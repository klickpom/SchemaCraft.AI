'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { ACTIVE_BOTS, type BotPurpose } from '@schemacraft/audit-core/bots/registry';
import { useUiLang } from '@/components/UiLangProvider';
import { buildRobotsTxt, normalizePaths, presetBlocked, type RobotsPreset } from '@schemacraft/audit-core/tools/robotsBuilder';

const PURPOSE: Record<BotPurpose, { en: string; ar: string; cls: string }> = {
  'search-citation': { en: 'Search & citations', ar: 'البحث والاقتباس', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' },
  'user-fetch': { en: 'User-triggered fetch', ar: 'جلب بطلب المستخدم', cls: 'text-sky-300 bg-sky-500/10 border-sky-500/30' },
  training: { en: 'Model training', ar: 'تدريب النماذج', cls: 'text-amber-300 bg-amber-500/10 border-amber-500/30' },
};

const PRESETS: { id: RobotsPreset; en: [string, string]; ar: [string, string] }[] = [
  { id: 'search-not-training', en: ['AI search yes, training no', 'Recommended for most sites'], ar: ['البحث الذكي نعم، التدريب لا', 'الأنسب لمعظم المواقع'] },
  { id: 'allow-all', en: ['Allow everything', 'Maximum visibility'], ar: ['السماح للجميع', 'أقصى ظهور'] },
  { id: 'block-ai', en: ['Block all AI', 'Keep only Google, Bing, Apple search'], ar: ['حجب كل الذكاء الاصطناعي', 'الإبقاء على بحث جوجل وBing وآبل فقط'] },
];

export default function RobotsTxtBuilder({ lang: pageLang = 'en' }: { lang?: 'en' | 'ar' }) {
  const lang = useUiLang(pageLang);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const [preset, setPreset] = useState<RobotsPreset | null>('search-not-training');
  const [blocked, setBlocked] = useState<string[]>(presetBlocked('search-not-training'));
  const [paths, setPaths] = useState('/admin/\n/cart/\n/checkout/');
  const [domain, setDomain] = useState('');
  const [copied, setCopied] = useState(false);

  const host = domain.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  const output = useMemo(
    () => buildRobotsTxt({ blocked, disallowPaths: normalizePaths(paths), sitemapUrl: host ? `https://${host}/sitemap.xml` : null }),
    [blocked, paths, host],
  );

  const applyPreset = (id: RobotsPreset) => {
    setPreset(id);
    setBlocked(presetBlocked(id));
  };
  const toggle = (id: string) => {
    setPreset(null);
    setBlocked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([output], { type: 'text/plain;charset=utf-8' }));
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0b12] p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label={t('Preset', 'الإعداد المسبق')}>
        {PRESETS.map((p) => {
          const [title, sub] = lang === 'ar' ? p.ar : p.en;
          const active = preset === p.id;
          return (
            <button key={p.id} type="button" role="radio" aria-checked={active} onClick={() => applyPreset(p.id)}
              className={`p-3.5 rounded-2xl border text-start transition ${active ? 'border-indigo-500 bg-indigo-950/40' : 'border-white/10 bg-black/30 hover:border-white/20'}`}>
              <span className="block text-sm font-bold text-white">{title}</span>
              <span className="block text-[12px] text-slate-400">{sub}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="space-y-1.5 text-xs font-semibold text-slate-300">
              <span>{t('Your domain (for the Sitemap line)', 'نطاق موقعك (لسطر Sitemap)')}</span>
              <input dir="ltr" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="yoursite.com"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-indigo-500/60" />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-300">
              <span>{t('Private paths to block for everyone', 'مسارات خاصة تُحجب عن الجميع')}</span>
              <textarea dir="ltr" value={paths} onChange={(e) => setPaths(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-indigo-500/60 resize-y" />
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('Crawlers', 'الزواحف')}</h3>
            <ul className="space-y-1.5">
              {ACTIVE_BOTS.map((bot) => {
                const allowed = !blocked.includes(bot.id);
                const purpose = PURPOSE[bot.purpose];
                return (
                  <li key={bot.id} className={`flex items-center gap-3 p-2.5 rounded-xl border ${allowed ? 'border-white/10 bg-black/20' : 'border-rose-500/30 bg-rose-950/15'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[13px] font-bold text-white" dir="ltr">{bot.userAgent}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${purpose.cls}`}>{lang === 'ar' ? purpose.ar : purpose.en}</span>
                        <a href={bot.docsUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-500 hover:text-cyan-300">{t('docs', 'التوثيق')} ↗</a>
                      </div>
                      <p className="text-[12px] text-slate-400 truncate">{bot.vendor} — {lang === 'ar' ? bot.purposeAr : bot.purposeEn}</p>
                    </div>
                    <button type="button" onClick={() => toggle(bot.id)} aria-pressed={allowed} aria-label={`${bot.userAgent}: ${allowed ? t('allowed', 'مسموح') : t('blocked', 'محجوب')}`}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${allowed ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' : 'text-rose-300 border-rose-500/40 bg-rose-500/10'}`}>
                      {allowed ? t('Allowed', 'مسموح') : t('Blocked', 'محجوب')}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-3 lg:sticky lg:top-24 self-start">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">robots.txt</h3>
            <div className="flex gap-2">
              <button type="button" onClick={download} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> {t('Download', 'تنزيل')}
              </button>
              <button type="button" onClick={copy} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white inline-flex items-center gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ')}
              </button>
            </div>
          </div>
          <pre dir="ltr" className="min-h-[260px] p-4 rounded-2xl bg-black/70 border border-white/10 text-[12.5px] font-mono text-emerald-200 overflow-x-auto leading-relaxed whitespace-pre">{output}</pre>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {t('Upload it to the root of your domain so it is served at https://yoursite.com/robots.txt. robots.txt is a request, not access control — firewalls and CDNs can still block crawlers you allow here.',
              'ارفعه في جذر نطاقك ليظهر على https://yoursite.com/robots.txt. ملف robots.txt طلب وليس تحكماً في الوصول — الجدار الناري والـ CDN قد يحجبان زواحف سمحت بها هنا.')}
          </p>
        </div>
      </div>
    </div>
  );
}
