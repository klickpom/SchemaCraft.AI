'use client';

import React from 'react';
import { Language } from '@/lib/translations';
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CompetitorComparisonProps {
  lang: Language;
}

export default function CompetitorComparison({ lang }: CompetitorComparisonProps) {
  const rows = [
    {
      featureEn: 'AI Search & GEO Diagnostic (ChatGPT / Perplexity)',
      featureAr: 'تشخيص وسيو محركات الذكاء الاصطناعي (ChatGPT و Perplexity)',
      schemacraft: true,
      schemaApp: false,
      yoast: false,
      googleTest: false,
    },
    {
      featureEn: 'Framework-Specific Code Fixes (Next.js 15, WP, Shopify)',
      featureAr: 'أكواد إصلاح مخصصة لمنصتك (Next.js 15 و WordPress و Shopify)',
      schemacraft: true,
      schemaApp: false,
      yoast: false,
      googleTest: false,
    },
    {
      featureEn: 'Live AI Citation & 5-Star SERP Preview Simulator',
      featureAr: 'محاكي حي لاقتباسات الذكاء الاصطناعي وبطاقات نجوم جوجل',
      schemacraft: true,
      schemaApp: false,
      yoast: false,
      googleTest: false,
    },
    {
      featureEn: 'WAF & Cloudflare AI Bot Pass-Through Generator',
      featureAr: 'مولد تصاريح جدران الحماية WAF لبوتات الذكاء الاصطناعي',
      schemacraft: true,
      schemaApp: false,
      yoast: false,
      googleTest: false,
    },
    {
      featureEn: 'Agency White-Label Client Report & PDF Export',
      featureAr: 'وضع التقارير التنفيذية وتصدير PDF لعملاء الوكالات',
      schemacraft: true,
      schemaApp: false,
      yoast: false,
      googleTest: false,
    },
    {
      featureEn: '0ms Instant AST Code Validator & AST Parser',
      featureAr: 'مختبر وتدقيق تركيبي فوري 0ms لأكواد JSON-LD',
      schemacraft: true,
      schemaApp: true,
      yoast: false,
      googleTest: true,
    },
    {
      featureEn: 'Pricing & Licensing Model',
      featureAr: 'نموذج التسعير والترخيص المالي',
      schemacraftText: '$9.00 One-Time (Lifetime Access)',
      schemacraftTextAr: '9$ فقط لمرة واحدة (مدى الحياة)',
      othersText: '$360+ / year recurring',
      othersTextAr: '360$+ سنوياً (اشتراك شهري)',
      isPricing: true,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#121220] via-[#0b0b14] to-[#06060a] p-6 sm:p-10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ar' ? 'مقارنة القيمة التنافسية' : 'Head-to-Head Architectural Comparison'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          {lang === 'ar'
            ? 'لماذا تتفوق SchemaCraft AI على الأدوات التقليدية؟'
            : 'Why Modern Teams Choose SchemaCraft AI Over Legacy Tools'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'مقارنة فنية شفافة بين منصتنا وحلول السيو التقليدية باهظة الثمن واشتراكاتها الشهرية المتكررة.'
            : 'A direct technical comparison between SchemaCraft AI and legacy subscription-locked SEO tools.'}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left rtl:text-right border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="py-3.5 px-4 font-semibold w-2/5">
                {lang === 'ar' ? 'الميزة / المعيار الفني' : 'Technical Capability'}
              </th>
              <th className="py-3.5 px-4 font-black text-cyan-300 bg-indigo-950/50 border-x border-t border-indigo-500/40 rounded-t-2xl text-center w-1/4">
                <span className="flex items-center justify-center gap-1.5 text-white">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>SchemaCraft AI</span>
                </span>
              </th>
              <th className="py-3.5 px-4 font-semibold text-slate-400 text-center">
                Schema App ($30/mo)
              </th>
              <th className="py-3.5 px-4 font-semibold text-slate-400 text-center">
                Yoast / Plugins
              </th>
              <th className="py-3.5 px-4 font-semibold text-slate-400 text-center">
                Google Rich Test
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition">
                <td className="py-3.5 px-4 font-medium text-white">
                  {lang === 'ar' ? row.featureAr : row.featureEn}
                </td>

                {/* SchemaCraft AI Column */}
                <td className="py-3.5 px-4 text-center bg-indigo-950/50 border-x border-indigo-500/40 font-bold">
                  {row.isPricing ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs whitespace-nowrap">
                      {lang === 'ar' ? row.schemacraftTextAr : row.schemacraftText}
                    </span>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                  )}
                </td>

                {/* Schema App Column */}
                <td className="py-3.5 px-4 text-center text-slate-400">
                  {row.isPricing ? (
                    <span className="text-xs text-rose-300/80 whitespace-nowrap">
                      {lang === 'ar' ? row.othersTextAr : row.othersText}
                    </span>
                  ) : row.schemaApp ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/80 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500/60 mx-auto" />
                  )}
                </td>

                {/* Yoast Column */}
                <td className="py-3.5 px-4 text-center text-slate-400">
                  {row.isPricing ? (
                    <span className="text-xs text-rose-300/80 whitespace-nowrap">
                      $99 / yr + plugins
                    </span>
                  ) : row.yoast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/80 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500/60 mx-auto" />
                  )}
                </td>

                {/* Google Test Column */}
                <td className="py-3.5 px-4 text-center text-slate-400">
                  {row.isPricing ? (
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      Free (Validator only)
                    </span>
                  ) : row.googleTest ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/80 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500/60 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
