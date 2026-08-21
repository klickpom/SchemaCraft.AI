import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import { Header } from '@/components/Header';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Footer } from '@/components/Footer';
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(PROGRAMMATIC_SEO_PAGES).map((slug) => ({
    type: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const pageData = PROGRAMMATIC_SEO_PAGES[type];

  if (!pageData) {
    return {
      title: 'Schema Not Found | SchemaCraft AI',
    };
  }

  return {
    title: pageData.title,
    description: pageData.metaDescription,
    keywords: [
      `${pageData.schemaCategory} schema generator`,
      `JSON-LD ${pageData.schemaCategory}`,
      'Google rich snippet builder',
      'Schema.org validated data',
      'AEO search optimization',
    ],
    openGraph: {
      title: pageData.title,
      description: pageData.metaDescription,
      url: `https://schemacraft-ai.site/schema/${type}`,
      type: 'article',
      siteName: 'SchemaCraft AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.metaDescription,
    },
  };
}

export default async function ProgrammaticSchemaPage({ params }: PageProps) {
  const { type } = await params;
  const pageData = PROGRAMMATIC_SEO_PAGES[type];

  if (!pageData) {
    notFound();
  }

  const categoryDef = SCHEMA_DEFINITIONS[pageData.schemaCategory];

  // Specific Page JSON-LD
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageData.h1,
    description: pageData.blufSummary,
    author: {
      '@type': 'Organization',
      name: 'SchemaCraft AI Global',
      url: 'https://schemacraft-ai.site',
    },
    about: {
      '@type': 'Thing',
      name: `Schema.org ${pageData.schemaCategory}`,
    },
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Dynamic Page JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        
        {/* HERO INTRO & BLUF */}
        <section className="space-y-6 text-center max-w-4xl mx-auto pt-2">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Programmatic Blueprint: {pageData.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {pageData.h1}
          </h1>

          {/* BLUF Technical Summary Box */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-md p-5 text-left text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>BLUF (Bottom Line Up Front) Technical Definition:</span>
            </div>
            <p>{pageData.blufSummary}</p>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-3 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Measured CTR Impact</span>
              <span className="text-lg font-black text-emerald-400">{pageData.ctrBoost}</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-3 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Indexing Velocity</span>
              <span className="text-lg font-black text-cyan-300">{pageData.indexingSpeed}</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-3 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Rich Snippet Type</span>
              <span className="text-xs font-bold text-white block mt-1 truncate">{categoryDef.googleRichResultType}</span>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-zinc-900/40 p-3 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase">Schema Standard</span>
              <span className="text-xs font-bold text-indigo-300 block mt-1">Schema.org v26.0</span>
            </div>
          </div>

        </section>

        {/* INTERACTIVE WORKSPACE PRE-FILLED FOR THIS ROUTE */}
        <section className="scroll-mt-20">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Interactive {categoryDef.name} Workspace:</span>
            </span>
            <Link href="/" className="text-xs text-indigo-400 hover:underline">
              ← View All 8 Schema Types
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
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              What are the mandatory and recommended fields for {pageData.schemaCategory}?
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Entity Property</th>
                  <th className="py-3 px-4 font-semibold">Data Type &amp; Format</th>
                  <th className="py-3 px-4 font-semibold">Requirement Level</th>
                  <th className="py-3 px-4 font-semibold text-cyan-300">Google Rich Snippet Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {pageData.technicalSpecs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">{spec.attribute}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">{spec.format}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          spec.requirement === 'Mandatory'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        }`}
                      >
                        {spec.requirement}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-300">{spec.googleImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* KEY BENEFITS */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Architectural Benefits for Technical SEO &amp; AEO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pageData.keyBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md p-5 space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
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
    </div>
  );
}
