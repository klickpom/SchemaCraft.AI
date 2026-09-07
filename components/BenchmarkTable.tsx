'use client';

import React from 'react';
import { BarChart3, ShieldCheck, Zap, Bot } from 'lucide-react';
import { CLAIMS } from '@/lib/content/claims';
import { SCHEMA_ORG_LABEL } from '@/lib/seo/standards';

export function BenchmarkTable() {
  const rows = [
    {
      schemaType: 'Product & Offer',
      whatItDoes: 'Declares price, availability, and optional reviews when those facts are visible on the page.',
    },
    {
      schemaType: 'SoftwareApplication',
      whatItDoes: 'Declares application category, OS, and offer details for SaaS and software listings.',
    },
    {
      schemaType: 'FAQPage',
      whatItDoes: 'Exposes question-answer pairs for retrieval crawlers. Google no longer shows FAQ rich results.',
    },
    {
      schemaType: 'LocalBusiness',
      whatItDoes: 'Declares NAP, geo, and opening hours for local entity understanding.',
    },
    {
      schemaType: 'Article',
      whatItDoes: 'Declares headline, dates, and author for news and editorial pages.',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>What each schema type is for</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Structured data describes the page. It does not guarantee a rich result.
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Schema type</th>
              <th className="py-3.5 px-4 font-semibold">What the markup does</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-zinc-300">
            {rows.map((row) => (
              <tr key={row.schemaType} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{row.schemaType}</td>
                <td className="py-3.5 px-4 text-zinc-300">{row.whatItDoes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Zap className="h-4 w-4" />
            <span>Validator</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{CLAIMS.validatorRunsInBrowser}</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <Bot className="h-4 w-4" />
            <span>IndexNow</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{CLAIMS.indexNow}</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>{SCHEMA_ORG_LABEL}</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">{CLAIMS.richResultsDisclaimer}</p>
        </div>
      </div>
    </section>
  );
}
