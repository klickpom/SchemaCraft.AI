'use client';

import React from 'react';
import Link from 'next/link';
import { ProgrammaticPageData } from '@/lib/seoData';
import { SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { FaqAccordion } from '@/components/FaqAccordion';
import { SiteChrome } from '@/components/SiteChrome';
import { withLang } from '@/lib/i18n/path';
import type { UiLang } from '@/lib/uiLang';
import { SCHEMA_ORG_LABEL } from '@/lib/seo/standards';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SchemaPageShellProps {
  pageData: ProgrammaticPageData;
  lang?: UiLang;
}

export default function SchemaPageShell({
  pageData,
  lang = 'en',
}: SchemaPageShellProps) {
  const categoryDef = SCHEMA_DEFINITIONS[pageData.schemaCategory];
  const ar = lang === 'ar';
  const dir = ar ? 'rtl' : 'ltr';

  return (
    <SiteChrome lang={lang}>

      <main dir={dir} lang={lang} className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        
        {/* HERO INTRO & BLUF */}
        <section className="space-y-6 text-center max-w-4xl mx-auto pt-2">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{ar ? 'مولد السكيما' : 'Schema generator'}: {pageData.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {pageData.h1}
          </h1>

          {/* BLUF Technical Summary Box */}
          <div className="rounded-2xl border border-white/[0.1] bg-black/60 backdrop-blur-md p-5 sm:p-6 text-start text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{ar ? 'الخلاصة أولاً' : 'Bottom line'}</span>
            </div>
            <p>{pageData.blufSummary}</p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">{ar ? 'ماذا يصف هذا الترميز' : 'What this markup does'}</span>
              <span className="text-sm font-bold text-emerald-400">{pageData.capabilityLabel}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">{ar ? 'الفهرسة' : 'Discovery'}</span>
              <span className="text-sm font-bold text-cyan-300">{pageData.discoveryNote}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">{ar ? 'نوع النتيجة المنسّقة' : 'Rich result type'}</span>
              <span className="text-xs font-bold text-white block mt-1 truncate">{categoryDef.googleRichResultType}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">{ar ? 'المعيار' : 'Schema standard'}</span>
              <span className="text-xs font-bold text-indigo-300 block mt-1">{SCHEMA_ORG_LABEL}</span>
            </div>
          </div>

        </section>

        {/* INTERACTIVE WORKSPACE PRE-FILLED FOR THIS ROUTE */}
        <section className="scroll-mt-20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>{ar ? 'المولد' : `Interactive ${categoryDef.name} generator`}</span>
            </span>
            <Link
              href={withLang('/#audit', lang)}
              className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>{ar ? 'افحص ظهور الصفحة في البحث الذكي' : 'Run the full AI search audit'}</span>
            </Link>
          </div>

          {ar && (
            <p className="text-xs text-slate-400 leading-7">
              القيم التجريبية داخل الحقول أمثلة فقط. اكتب ما يظهر فعلاً في صفحتك. الترميز الصحيح لا يضمن نتيجة منسّقة في جوجل.
            </p>
          )}
          <SchemaBuilder
            initialCategory={pageData.schemaCategory}
            initialValuesOverride={pageData.presetOverride}
            lang={lang}
          />
        </section>

        {/* TECHNICAL FIELD SPECIFICATIONS */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{ar ? 'خصائص موثّقة لدى Google Search Central' : 'Documented Google Search Central properties'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {ar ? `الخصائص الإلزامية والمُستحسنة لـ ${pageData.schemaCategory}` : `Required and recommended properties for ${pageData.schemaCategory}`}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-md overflow-x-auto shadow-xl">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4 font-semibold">{ar ? 'الخاصية' : 'Property'}</th>
                  <th className="py-3.5 px-4 font-semibold">{ar ? 'الصيغة' : 'Format'}</th>
                  <th className="py-3.5 px-4 font-semibold">{ar ? 'المستوى' : 'Requirement'}</th>
                  <th className="py-3.5 px-4 font-semibold text-cyan-300">{ar ? 'ماذا قد يظهر في جوجل' : 'What Google may show'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {pageData.technicalSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white" dir="ltr">{spec.attribute}</td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono" dir="ltr">{spec.format}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          spec.requirement === 'Mandatory'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        }`}
                      >
                        {spec.requirement}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 font-medium">{spec.googleImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* KEY BENEFITS */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {ar ? 'ماذا يفيد هذا الترميز' : 'What this markup is for'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pageData.keyBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-md p-5 space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{benefit.title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TAILORED FAQ ACCORDION */}
        <section className="scroll-mt-20">
          <FaqAccordion items={pageData.faqs} lang={lang} />
        </section>

      </main>
    </SiteChrome>
  );
}
