'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, FileCode2, Gauge, ListChecks, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import AuditRunner from '@/components/audit/AuditRunner';
import { CHECK_AREAS, HOME_FAQ } from '@/lib/content/home';

const EXAMPLES = ['stripe.com', 'bbc.com/news', 'example.com'];

const TOOLS = [
  { href: '/ai-crawler-checker/', icon: Bot, en: ['AI crawler checker', 'See which AI bots robots.txt and your firewall let through.'], ar: ['فاحص زواحف الذكاء الاصطناعي', 'اعرف أي بوتات يسمح بها robots.txt والجدار الناري.'] },
  { href: '/robots-txt-generator/', icon: ShieldCheck, en: ['robots.txt generator', 'Allow AI search, block training — with the right user-agents.'], ar: ['مولد robots.txt', 'اسمح للبحث الذكي وامنع التدريب بالوكلاء الصحيحة.'] },
  { href: '/llms-txt-generator/', icon: FileCode2, en: ['llms.txt generator', 'Create a clean llms.txt map of your key pages.'], ar: ['مولد llms.txt', 'أنشئ ملف llms.txt منظماً لصفحاتك الأساسية.'] },
  { href: '/schema-validator/', icon: ListChecks, en: ['Schema validator', 'Paste JSON-LD and get required-property errors.'], ar: ['مدقق السكيما', 'الصق JSON-LD واعرف الخصائص الناقصة.'] },
  { href: '/json-ld-generator/', icon: Sparkles, en: ['JSON-LD generators', 'Product, LocalBusiness, Article, FAQ and more.'], ar: ['مولدات JSON-LD', 'منتج، نشاط محلي، مقال، أسئلة شائعة والمزيد.'] },
  { href: '/ai-crawlers/', icon: Search, en: ['AI crawler list', 'Every AI user-agent, what it does and how to control it.'], ar: ['قائمة زواحف الذكاء الاصطناعي', 'كل وكيل، وظيفته، وطريقة التحكم فيه.'] },
];

export default function HomeClient({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const faq = HOME_FAQ[lang];
  const areas = CHECK_AREAS[lang];

  return (
    <SiteChrome lang={lang}>
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-16 sm:space-y-24 overflow-x-hidden">
        <section id="audit" className="relative text-center max-w-4xl mx-auto space-y-5 sm:space-y-6 px-1 scroll-mt-24">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] h-[300px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full -z-10" aria-hidden />
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-cyan-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {t('Free · No sign-up · Every score explained', 'مجاني · بدون تسجيل · كل درجة لها تفسير')}
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-gradient-metallic">
            {t('Can ChatGPT, Google and Perplexity actually read your site?', 'هل يستطيع ChatGPT وجوجل وPerplexity قراءة موقعك فعلاً؟')}
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              'SchemaCraft is a free AI search visibility audit. It shows whether ChatGPT, Google, Perplexity and Claude can crawl, read and cite a page, using about 50 SEO, GEO and AEO checks. Every problem includes the evidence and a copy-paste fix. The full report is free, limited to 20 audits per 10 minutes, and most audits finish within 20 seconds.',
              'SchemaCraft أداة مجانية لفحص ظهور موقعك في البحث الذكي. تبيّن هل يستطيع ChatGPT وجوجل وPerplexity وClaude الزحف لصفحتك وقراءتها والاقتباس منها، عبر حوالي 50 فحصاً للسيو وGEO وAEO. كل مشكلة معها الدليل وإصلاح جاهز للنسخ. التقرير كامل ومجاني، بحد 20 فحصاً كل 10 دقائق، ومعظم الفحوص تنتهي خلال 20 ثانية.',
            )}
          </p>
          <AuditRunner lang={lang} examples={EXAMPLES} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto" aria-label={t('How it works', 'طريقة العمل')}>
          {[
            [Search, t('1. Real crawl, no guessing', '1. زحف حقيقي بدون تخمين'), t('Our server requests your page, robots.txt, sitemap and llms.txt, then repeats the request as Googlebot, OAI-SearchBot, PerplexityBot and ClaudeBot.', 'سيرفرنا يطلب صفحتك وrobots.txt وخريطة الموقع وllms.txt، ثم يكرر الطلب بوكيل Googlebot وOAI-SearchBot وPerplexityBot وClaudeBot.')],
            [Gauge, t('2. Score built only from evidence', '2. درجة مبنية على الأدلة فقط'), t('Each check is pass, warning or fail with the raw evidence. Anything we could not verify is marked “Not assessed” and does not count.', 'كل فحص ناجح أو تحذير أو فشل مع الدليل الخام. أي شيء لم نتمكن من التحقق منه يُكتب "غير مُقيَّم" ولا يُحسب.')],
            [Wrench, t('3. Copy-paste fixes', '3. إصلاحات جاهزة للنسخ'), t('Every issue comes with the exact robots.txt line, meta tag or JSON-LD to add — prefilled with your site’s details where we can.', 'كل مشكلة معها سطر robots.txt أو وسم الميتا أو JSON-LD المطلوب بالضبط — مملوءاً ببيانات موقعك حيثما أمكن.')],
          ].map(([Icon, title, body]) => {
            const I = Icon as typeof Search;
            return (
              <div key={title as string} className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0c0c14] space-y-2.5">
                <I className="w-5 h-5 text-cyan-400" aria-hidden />
                <h2 className="text-base font-bold text-white">{title as string}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{body as string}</p>
              </div>
            );
          })}
        </section>

        <section className="space-y-8" aria-labelledby="what-we-check">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 id="what-we-check" className="text-2xl sm:text-4xl font-black text-white tracking-tight">{t('What the audit checks', 'ماذا يفحص التقرير')}</h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {t(
                'AI search engines retrieve pages much like search crawlers do — then decide whether a passage is clear and trustworthy enough to quote. The audit covers both halves: access and answerability.',
                'محركات البحث الذكي تجلب الصفحات تقريباً كما تفعل زواحف البحث — ثم تقرر هل الفقرة واضحة وموثوقة بما يكفي للاقتباس. الفحص يغطي الجانبين: الوصول وقابلية الإجابة.',
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {areas.map((area, i) => (
              <div key={area.title} className={`p-5 rounded-2xl border space-y-3 ${i === 0 ? 'border-indigo-500/30 bg-indigo-950/20' : 'border-white/10 bg-[#0c0c14]'}`}>
                <h3 className={`text-sm font-bold ${i === 0 ? 'text-cyan-300' : 'text-white'}`}>{area.title}</h3>
                <ul className="space-y-1.5">
                  {area.checks.map((c) => (
                    <li key={c} className="flex items-start gap-1.5 text-[12px] text-slate-300 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start" aria-labelledby="ai-vs-seo">
          <div className="space-y-4">
            <h2 id="ai-vs-seo" className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('Why a normal SEO audit misses AI search', 'لماذا يفوت فحص السيو العادي البحث الذكي')}</h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t(
                'Most AI crawlers do not run JavaScript, follow their own robots.txt user-agents, and are often blocked by CDN “bot protection” that Googlebot gets through. A site can rank on Google and still be invisible to ChatGPT Search.',
                'معظم زواحف الذكاء الاصطناعي لا تشغّل الجافاسكربت، ولها وكلاء خاصة في robots.txt، وكثيراً ما تحجبها "حماية البوتات" في الـ CDN بينما يمر Googlebot. قد يتصدر موقعك في جوجل ويظل غير مرئي لبحث ChatGPT.',
              )}
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              {[
                t('Training crawlers (GPTBot, ClaudeBot, Google-Extended) are separate from search crawlers — block one without losing the other.', 'زواحف التدريب (GPTBot وClaudeBot وGoogle-Extended) منفصلة عن زواحف البحث — امنع الأولى دون أن تخسر الثانية.'),
                t('Content rendered only in the browser is an empty page to OAI-SearchBot and PerplexityBot.', 'المحتوى الذي يُرسم في المتصفح فقط صفحة فارغة بالنسبة لـ OAI-SearchBot وPerplexityBot.'),
                t('Clear definitions, question headings and lists are what answer engines quote.', 'التعريفات الواضحة والعناوين بصيغة أسئلة والقوائم هي ما تقتبسه محركات الإجابة.'),
              ].map((line) => (
                <li key={line} className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 rtl:rotate-180" aria-hidden />{line}</li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-2">
              <Link href="/should-i-block-gptbot/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:underline">
                {t('Should you block GPTBot?', 'هل تمنع GPTBot؟')} <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link href="/chatgpt-search/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:underline">
                {t('How to show up in ChatGPT Search', 'كيف تظهر في بحث ChatGPT')} <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link href="/geo-vs-aeo/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:underline">
                {t('Read: GEO vs AEO vs SEO explained', 'اقرأ: شرح الفرق بين GEO وAEO وSEO')} <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">{t('Search crawler vs training crawler', 'زاحف البحث مقابل زاحف التدريب')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-left rtl:text-right">
                <thead className="text-slate-400 text-[10px] uppercase tracking-wider">
                  <tr><th className="py-2 pe-3">{t('Vendor', 'الشركة')}</th><th className="py-2 pe-3">{t('Search / citations', 'البحث والاقتباس')}</th><th className="py-2">{t('Training', 'التدريب')}</th></tr>
                </thead>
                <tbody className="font-mono text-slate-200">
                  {[['OpenAI', 'OAI-SearchBot, ChatGPT-User', 'GPTBot'], ['Google', 'Googlebot', 'Google-Extended'], ['Anthropic', 'Claude-SearchBot, Claude-User', 'ClaudeBot'], ['Perplexity', 'PerplexityBot, Perplexity-User', '—'], ['Apple', 'Applebot', 'Applebot-Extended']].map(([v, s, tr]) => (
                    <tr key={v} className="border-t border-white/5"><td className="py-2 pe-3 font-sans font-semibold text-white">{v}</td><td className="py-2 pe-3 text-emerald-300">{s}</td><td className="py-2 text-amber-300">{tr}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/ai-crawlers/" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:underline">
              {t('Full AI crawler list with official docs', 'القائمة الكاملة مع التوثيق الرسمي')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="free-tools">
          <h2 id="free-tools" className="text-2xl sm:text-3xl font-black text-white tracking-tight text-center">{t('Free tools for AI search visibility', 'أدوات مجانية للظهور في البحث الذكي')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOOLS.map((tool) => {
              const [title, desc] = lang === 'ar' ? tool.ar : tool.en;
              return (
                <Link key={tool.href} href={tool.href} className="group p-5 rounded-2xl border border-white/10 bg-[#0c0c14] hover:border-indigo-500/40 transition space-y-2">
                  <tool.icon className="w-5 h-5 text-indigo-400" aria-hidden />
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">{title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed">{desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="max-w-3xl mx-auto space-y-5" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl sm:text-3xl font-black text-white tracking-tight text-center">{t('Frequently asked questions', 'الأسئلة الشائعة')}</h2>
          <div className="space-y-2.5">
            {faq.map((item, i) => (
              <details key={item.q} className="group rounded-2xl border border-white/10 bg-black/40 open:border-indigo-500/40 open:bg-indigo-950/20" open={i === 0}>
                <summary className="cursor-pointer list-none p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-white">
                  <h3 className="text-sm font-bold">{item.q}</h3>
                  <span className="text-slate-400 group-open:rotate-45 transition text-lg leading-none" aria-hidden>+</span>
                </summary>
                <p className="px-4 sm:px-5 pb-5 text-sm text-slate-300 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
