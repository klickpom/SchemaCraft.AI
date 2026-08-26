'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProgrammaticPageData } from '@/lib/seoData';
import { SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import { Header } from '@/components/Header';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Footer } from '@/components/Footer';
import { PaywallModal } from '@/components/PaywallModal';
import { isProUnlockedClient } from '@/lib/payment';
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
}

export default function SchemaPageShell({
  pageData,
}: SchemaPageShellProps) {
  const categoryDef = SCHEMA_DEFINITIONS[pageData.schemaCategory];
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    setIsProUnlocked(isProUnlockedClient());
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08080f] text-zinc-100 flex flex-col font-sans">
      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <Header
        onOpenPaywall={() => setShowPaywall(true)}
        isPro={isProUnlocked}
      />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        
        {/* HERO INTRO & BLUF */}
        <section className="space-y-6 text-center max-w-4xl mx-auto pt-2">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Programmatic Blueprint: {pageData.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {pageData.h1}
          </h1>

          {/* BLUF Technical Summary Box */}
          <div className="rounded-2xl border border-white/[0.1] bg-black/60 backdrop-blur-md p-5 sm:p-6 text-left text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>BLUF (Bottom Line Up Front) Technical Definition:</span>
            </div>
            <p>{pageData.blufSummary}</p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Measured CTR Impact</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{pageData.ctrBoost}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Indexing Velocity</span>
              <span className="text-lg font-black text-cyan-300 font-mono">{pageData.indexingSpeed}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Rich Snippet Type</span>
              <span className="text-xs font-bold text-white block mt-1 truncate">{categoryDef.googleRichResultType}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Schema Standard</span>
              <span className="text-xs font-bold text-indigo-300 block mt-1 font-mono">Schema.org v26.0</span>
            </div>
          </div>

        </section>

        {/* INTERACTIVE WORKSPACE PRE-FILLED FOR THIS ROUTE */}
        <section className="scroll-mt-20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Interactive {categoryDef.name} Generator:</span>
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 transition flex items-center gap-1"
            >
              <span>← Run Full AI Search Audit</span>
            </Link>
          </div>

          <SchemaBuilder
            initialCategory={pageData.schemaCategory}
            initialValuesOverride={pageData.presetOverride}
          />
        </section>

        {/* TECHNICAL FIELD SPECIFICATIONS */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Google Search Central 2026 Spec</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Mandatory and Recommended Properties for {pageData.schemaCategory}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-md overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4 font-semibold">Entity Property</th>
                  <th className="py-3.5 px-4 font-semibold">Data Type &amp; Format</th>
                  <th className="py-3.5 px-4 font-semibold">Requirement Level</th>
                  <th className="py-3.5 px-4 font-semibold text-cyan-300">Google Rich Snippet Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {pageData.technicalSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">{spec.attribute}</td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono">{spec.format}</td>
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
            Architectural Benefits for Technical SEO &amp; AEO
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
          <FaqAccordion items={pageData.faqs} />
        </section>

      </main>

      <Footer />

      {/* Interactive Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={() => {
          setIsProUnlocked(true);
          setShowPaywall(false);
        }}
      />
    </div>
  );
}
