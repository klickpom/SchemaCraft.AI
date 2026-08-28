'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface FaqSectionProps {
  lang: Language;
}

interface FaqItem {
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
}

const FAQS: FaqItem[] = [
  {
    qEn: 'What is the difference between SEO, GEO, and AEO?',
    qAr: 'ما هو الفرق بين الـ SEO والـ GEO والـ AEO؟',
    aEn: 'Traditional SEO optimizes for keyword positions in Google search. GEO (Generative Engine Optimization) structures entity relations so Large Language Models understand your brand authority. AEO (Answer Engine Optimization) structures concise BLUF answers and Schema.org graphs so ChatGPT Search, Perplexity, and Google AI Overviews directly cite your domain as the primary source.',
    aAr: 'الـ SEO التقليدي يركز على ترتيب الكلمات في جوجل. أما GEO (تحسين محركات الذكاء الاصطناعي التوليدي) فيبني شبكة الكيانات المعرفية ليفهم الذكاء الاصطناعي علامتك التجارية. و AEO (تحسين محركات الإجابة) يقوم بهيكلة إجابات مباشرة وسريعة (BLUF) وسكيما معتمدة لتستشهد بك محركات ChatGPT Search و Perplexity و Google AI Overviews كمصدر رسمي.',
  },
  {
    qEn: 'How does SchemaCraft AI audit websites for Google and AI Search Engines?',
    qAr: 'كيف يقوم SchemaCraft AI بفحص وتدقيق المواقع لمحركات بحث جوجل والذكاء الاصطناعي؟',
    aEn: 'SchemaCraft executes a deterministic multi-wave crawler that analyzes HTTP server status, noindex gates, robots.txt bot rules (OAI-SearchBot, PerplexityBot, Claude-Web), BLUF lead answerability, and Schema.org JSON-LD graph integrity in 0ms.',
    aAr: 'يقوم SchemaCraft بتشغيل زاحف فني يفحص استجابة الخادم، بوابات الفهرسة، أوامر ملف robots.txt لبوتات الذكاء الاصطناعي (مثل OAI-SearchBot و PerplexityBot)، وضوح الإجابات المباشرة (BLUF)، واكتمال بيانات Schema.org JSON-LD بدقة وحتمية وبدون أي تخمين.',
  },
  {
    qEn: 'Why is Schema.org JSON-LD structured data essential for Google Rich Results?',
    qAr: 'لماذا تعتبر بيانات Schema.org JSON-LD ضرورية للحصول على النتائج الغنية في جوجل؟',
    aEn: 'Schema.org JSON-LD gives search engines explicit machine-readable context. It unlocks Google Rich Snippets—including 5-star review ratings, pricing badges, FAQ drop-down drawers, and video key moments—which boosts organic click-through rate (CTR) by over 30%.',
    aAr: 'تزود سكيما JSON-LD محركات البحث ببيانات منظمة يفهمها الروبوت فوراً. هذا يفعل المزايا البصرية في جوجل (النتائج الغنية) مثل نجوم التقييم الخماسية، شارات الأسعار والمخزون، قوائم الأسئلة الشائعة، ولحظات الفيديو، مما يرفع نسبة النقر بنسبة تتجاوز 30%.',
  },
  {
    qEn: 'How do I add the generated Schema JSON-LD to WordPress, Next.js, or Shopify?',
    qAr: 'كيف أقوم بتركيب كود السكيما المولد في ووردبريس أو نكست جي اس أو شوبيفاي؟',
    aEn: 'In Next.js, insert the <script type="application/ld+json"> tag into your layout.tsx Server Component. In WordPress, paste the generated PHP hook into functions.php or your SEO plugin. In Shopify, paste the Liquid snippet directly into theme.liquid before the </head> tag.',
    aAr: 'في Next.js: ضع وسم <script type="application/ld+json"> داخل ملف layout.tsx. في ووردبريس: الصق هوك الـ PHP المولد داخل functions.php أو إضافات السيو. في شوبيفاي: الصق كود Liquid مباشرة داخل theme.liquid قبل وسم الإغلاق </head>.',
  },
  {
    qEn: 'What is included in the $9 One-Time Lifetime Pass vs Free Audit?',
    qAr: 'ما الذي يتضمنه فحص الـ 9$ لمرة واحدة مدى الحياة مقارنة بالفحص المجاني؟',
    aEn: 'The Free Audit provides instant scores across 5 dimensions and uncovers the top 3 critical blockers. The $9 Lifetime Pass unlocks all 17+ detected issues, generates customized copy-paste code fixes for WordPress, Next.js, and Shopify, reveals the full AI Search Opportunity Matrix, and enables white-label PDF executive exports.',
    aAr: 'الفحص المجاني يعطيك تقييماً عبر الأبعاد الـ 5 مع كشف أول 3 مشاكل رئيسية. باقة الـ 9$ مدى الحياة تفتح لك كافة المشاكل الـ 17+ بالكامل، وتولد لك أكواد الإصلاح المباشرة لمنصتك (WordPress, Next.js, Shopify)، وتكشف مصفوفة فرص الظهور في الذكاء الاصطناعي، مع إمكانية تصدير تقارير PDF للعملاء والوكالات.',
  },
  {
    qEn: 'Is there a money-back guarantee for the $9 Pro Audit?',
    qAr: 'هل هناك ضمان استرداد للأموال لخدمة الـ 9$؟',
    aEn: 'Yes! SchemaCraft AI comes with an unconditional 30-Day Money-Back Guarantee. If the platform-specific code fixes and audit insights do not provide immediate value for your website, you can request a full refund with zero questions asked.',
    aAr: 'نعم بكل تأكيد! تأتي الخدمة مع ضمان استرداد كامل للأموال لمدة 30 يوماً بدون أي شروط أو تعقيدات في حال لم تجد الفائدة المباشرة لأكواد الإصلاح ومصفوفة السكيما لموقعك.',
  },
];

export default function FaqSection({ lang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-indigo-300">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'الأسئلة الشائعة والمعايير الفنية' : 'Frequently Asked Technical Questions'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'كل ما تحتاج معرفته عن تصدر محركات بحث الذكاء الاصطناعي والسكيما'
              : 'Everything You Need to Know About AI Search & Schema'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'إجابات مباشرة ودقيقة عن معايير GEO و AEO وهيكلة Schema.org JSON-LD وكيفية تصدر نتائج البحث.'
              : 'Direct authoritative answers regarding GEO, AEO standards, Schema.org graph architectures, and AI search indexing.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 shrink-0">
          Schema.org/FAQPage Verified
        </div>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-950/30'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left rtl:text-right transition cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-white">
                  {lang === 'ar' ? faq.qAr : faq.qEn}
                </span>
                <div
                  className={`p-1.5 rounded-lg border shrink-0 transition-transform ${
                    isOpen
                      ? 'bg-indigo-600 border-indigo-400 text-white rotate-180'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  <p>{lang === 'ar' ? faq.aAr : faq.aEn}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
