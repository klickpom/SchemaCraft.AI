'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import type { AuditCheck, FixSnippet } from '@/lib/audit/types';
import { L, type Lang } from './i18n';
import { StatusPill } from './StatusPill';

const PLACEMENT: Record<FixSnippet['language'], { en: string[]; ar: string[] }> = {
  html: {
    en: [
      'Plain HTML: inside <head> of this page (or the shared layout/template).',
      'WordPress: your SEO plugin\'s head settings, or a wp_head hook in a child theme.',
      'Next.js App Router: the metadata export / <head> of the route\'s layout.',
      'Shopify: theme.liquid inside <head>, or the relevant section template.',
    ],
    ar: [
      'HTML عادي: داخل <head> لهذه الصفحة (أو القالب المشترك).',
      'ووردبريس: إعدادات head في إضافة السيو، أو hook على wp_head في قالب فرعي.',
      'Next.js App Router: تصدير metadata أو <head> في layout الخاص بالمسار.',
      'شوبيفاي: theme.liquid داخل <head> أو قالب القسم المناسب.',
    ],
  },
  json: {
    en: [
      'Wrap it in <script type="application/ld+json">…</script> in the page <head> or body.',
      'WordPress: a code-snippets plugin or your SEO plugin\'s schema settings (avoid duplicate Organization nodes).',
      'Next.js: render it from a Server Component with dangerouslySetInnerHTML.',
      'Shopify: a snippet included in theme.liquid; use Liquid variables for live values.',
      'Validate with Google\'s Rich Results Test after publishing.',
    ],
    ar: [
      'ضعه داخل <script type="application/ld+json">…</script> في <head> أو body الصفحة.',
      'ووردبريس: إضافة code snippets أو إعدادات السكيما في إضافة السيو (تجنب تكرار Organization).',
      'Next.js: اعرضه من Server Component باستخدام dangerouslySetInnerHTML.',
      'شوبيفاي: snippet مضمّن في theme.liquid مع متغيرات Liquid للقيم الحية.',
      'تحقق منه بأداة Rich Results Test من جوجل بعد النشر.',
    ],
  },
  text: {
    en: [
      'This goes in /robots.txt at the root of the domain.',
      'WordPress: Yoast/Rank Math → File editor, or the physical robots.txt file.',
      'Next.js: app/robots.ts (or public/robots.txt for static export).',
      'Shopify: Online Store → Themes → Edit code → robots.txt.liquid.',
      'Cloudflare: also check Security → Bots and any "Block AI bots" setting.',
    ],
    ar: [
      'هذا يوضع في /robots.txt في جذر النطاق.',
      'ووردبريس: Yoast أو Rank Math ← محرر الملفات، أو ملف robots.txt الفعلي.',
      'Next.js: app/robots.ts (أو public/robots.txt في التصدير الثابت).',
      'شوبيفاي: المتجر ← القوالب ← تعديل الكود ← robots.txt.liquid.',
      'Cloudflare: راجع أيضاً Security ← Bots وخيار "حظر بوتات الذكاء الاصطناعي".',
    ],
  },
  apache: {
    en: ['Add to the .htaccess file in your site root (Apache / LiteSpeed / Hostinger).', 'Test the site immediately after saving — a typo returns HTTP 500.'],
    ar: ['أضفه إلى ملف .htaccess في جذر الموقع (Apache أو LiteSpeed أو Hostinger).', 'اختبر الموقع فور الحفظ — أي خطأ كتابي يرجع HTTP 500.'],
  },
  nginx: {
    en: ['Add to the server { } block of your Nginx config, then run nginx -t and reload.'],
    ar: ['أضفه داخل server { } في إعدادات Nginx ثم شغّل nginx -t وأعد التحميل.'],
  },
  markdown: {
    en: ['Save as /llms.txt at the domain root, served as text/plain or text/markdown.', 'Replace the placeholders with your real pages — keep it short and current.'],
    ar: ['احفظه باسم /llms.txt في جذر النطاق بنوع text/plain أو text/markdown.', 'استبدل العناصر النائبة بصفحاتك الحقيقية — اجعله قصيراً ومحدّثاً.'],
  },
};

export default function FixModal({ check, lang, onClose }: { check: AuditCheck | null; lang: Lang; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!check) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [check, onClose]);

  if (!check) return null;
  const snippet = check.fixSnippet;
  const placement = snippet ? PLACEMENT[snippet.language] : null;

  const copy = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md" onClick={onClose} role="dialog" aria-modal="true" aria-label={L(lang, check.title, check.titleAr)}>
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#12121a] shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5 bg-[#161622] rounded-t-2xl">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill status={check.status} lang={lang} />
              <span className="text-[10px] uppercase font-mono text-slate-400">{check.severity} · {check.category.replace('_', ' ')}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{L(lang, check.title, check.titleAr)}</h3>
            <p className="text-xs text-slate-300">{L(lang, check.detail, check.detailAr)}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white shrink-0" aria-label={L(lang, 'Close', 'إغلاق')}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{L(lang, 'Evidence from the page', 'الدليل من الصفحة')}</h4>
            <pre className="p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-200 whitespace-pre-wrap break-words">{L(lang, check.evidence, check.evidenceAr)}</pre>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{L(lang, 'Why it matters', 'لماذا يهم')}</h4>
            <p className="text-slate-300 leading-relaxed">{L(lang, check.why, check.whyAr)}</p>
            {check.source && (
              <a href={check.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:underline">
                {L(lang, 'Official documentation', 'التوثيق الرسمي')} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </section>

          {check.fix && (
            <section className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{L(lang, 'How to fix', 'طريقة الإصلاح')}</h4>
              <p className="text-slate-200 leading-relaxed">{L(lang, check.fix, check.fixAr)}</p>
            </section>
          )}

          {snippet && (
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-indigo-300">{L(lang, snippet.label, snippet.labelAr)}</span>
                <button type="button" onClick={copy} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? L(lang, 'Copied', 'تم النسخ') : L(lang, 'Copy code', 'نسخ الكود')}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-3.5 rounded-xl border border-white/10 bg-[#08080c] font-mono text-[11px] text-slate-200 overflow-x-auto max-h-72 leading-relaxed text-left">{snippet.code}</pre>
              {placement && (
                <ul className="space-y-1 p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-100 leading-relaxed list-disc ps-5">
                  {(lang === 'ar' ? placement.ar : placement.en).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-3 bg-[#161622] rounded-b-2xl flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">{L(lang, 'Re-run the audit after deploying to confirm the fix.', 'أعد الفحص بعد النشر للتأكد من الإصلاح.')}</span>
          <button type="button" onClick={onClose} className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold">
            {L(lang, 'Close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
}
