import React from 'react';
import Link from 'next/link';
import { schemaPath } from '@/lib/seo/urls';

const COLUMNS = [
  {
    en: 'Free tools',
    ar: 'أدوات مجانية',
    links: [
      { href: '/', en: 'AI search & SEO audit', ar: 'فحص السيو والبحث الذكي' },
      { href: '/ai-crawler-checker/', en: 'AI crawler checker', ar: 'فاحص زواحف الذكاء الاصطناعي' },
      { href: '/robots-txt-generator/', en: 'robots.txt generator', ar: 'مولد robots.txt' },
      { href: '/llms-txt-generator/', en: 'llms.txt generator', ar: 'مولد llms.txt' },
      { href: '/schema-validator/', en: 'Schema validator', ar: 'مدقق السكيما' },
      { href: '/json-ld-generator/', en: 'JSON-LD generator', ar: 'مولد JSON-LD' },
    ],
  },
  {
    en: 'Guides',
    ar: 'أدلة',
    links: [
      { href: '/should-i-block-gptbot/', en: 'Should you block GPTBot?', ar: 'هل تمنع GPTBot؟' },
      { href: '/chatgpt-search/', en: 'Show up in ChatGPT Search', ar: 'الظهور في بحث ChatGPT' },
      { href: '/ai-crawlers/', en: 'AI crawler user-agent list', ar: 'قائمة وكلاء زواحف الذكاء الاصطناعي' },
      { href: '/geo-vs-aeo/', en: 'GEO vs AEO vs SEO', ar: 'الفرق بين GEO وAEO وSEO' },
      { href: '/about/', en: 'Audit methodology', ar: 'منهجية الفحص' },
      { href: '/ar/', en: 'العربية', ar: 'English' },
    ],
  },
  {
    en: 'Schema generators',
    ar: 'مولدات السكيما',
    links: [
      { href: schemaPath('shopify-product'), en: 'Shopify product', ar: 'منتج شوبيفاي' },
      { href: schemaPath('woocommerce-product-schema'), en: 'WooCommerce product', ar: 'منتج ووكومرس' },
      { href: schemaPath('local-seo-schema'), en: 'Local business', ar: 'نشاط محلي' },
      { href: schemaPath('medical-clinic-doctor-schema'), en: 'Medical clinic', ar: 'عيادة طبية' },
      { href: schemaPath('nextjs-software'), en: 'Software / SaaS', ar: 'برنامج / SaaS' },
      { href: schemaPath('saas-faq'), en: 'FAQPage', ar: 'الأسئلة الشائعة' },
    ],
  },
];

export function Footer({ lang = 'en', onToggleLang }: { lang?: 'en' | 'ar'; onToggleLang?: () => void }) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] text-zinc-400 text-xs mt-20 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href={lang === 'ar' ? '/ar/' : '/'} className="flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-indigo-400/30 bg-[#09090b]">
                <img src="/logo.png" alt="" width={32} height={32} className="h-full w-full object-cover" />
              </span>
              <span className="font-bold text-white text-base">SchemaCraft AI</span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {t(
                'Free audit that shows whether Google, ChatGPT, Perplexity and Claude can crawl, understand and quote your page — with the evidence and the exact fix for every issue.',
                'فحص مجاني يوضح هل يستطيع جوجل وChatGPT وPerplexity وClaude الزحف لصفحتك وفهمها والاقتباس منها — مع الدليل والإصلاح الدقيق لكل مشكلة.',
              )}
            </p>
            <a href="https://x.com/SchemaCraftAI" target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-zinc-300">
              @SchemaCraftAI
            </a>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.en} className="space-y-2.5">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">{t(col.en, col.ar)}</h2>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href === '/ar/' ? (
                      <button type="button" onClick={onToggleLang} className="hover:text-cyan-400 transition-colors">
                        {t(link.en, link.ar)}
                      </button>
                    ) : (
                      <Link href={lang === 'ar' && link.href === '/' ? '/ar/' : link.href} className="hover:text-cyan-400 transition-colors">
                        {t(link.en, link.ar)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} SchemaCraft AI</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/privacy/" className="hover:text-cyan-400">{t('Privacy', 'الخصوصية')}</Link>
            <Link href="/terms/" className="hover:text-cyan-400">{t('Terms', 'الشروط')}</Link>
            <Link href="/about/" className="hover:text-cyan-400">{t('About', 'من نحن')}</Link>
            <a href="mailto:support@schemacraft-ai.site" className="hover:text-cyan-400">support@schemacraft-ai.site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
