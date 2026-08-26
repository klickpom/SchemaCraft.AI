'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Language } from '@/lib/translations';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Terminal,
  ShieldCheck,
  Building2,
  Layers,
  GraduationCap,
  Calendar,
  FileText,
  Video,
  Zap,
} from 'lucide-react';

interface SchemaDirectoryHubProps {
  lang: Language;
}

type IndustryCategory = 'all' | 'ecom' | 'tech' | 'local' | 'media';

export default function SchemaDirectoryHub({ lang }: SchemaDirectoryHubProps) {
  const [activeFilter, setActiveFilter] = useState<IndustryCategory>('all');

  const getIconForSlug = (slug: string) => {
    if (slug.includes('shopify') || slug.includes('woocommerce') || slug.includes('product') || slug.includes('recipe')) return ShoppingBag;
    if (slug.includes('nextjs') || slug.includes('saas') || slug.includes('yoast')) return Terminal;
    if (slug.includes('medical') || slug.includes('legal') || slug.includes('local') || slug.includes('organization')) return ShieldCheck;
    if (slug.includes('course')) return GraduationCap;
    if (slug.includes('event')) return Calendar;
    if (slug.includes('video')) return Video;
    return Layers;
  };

  const getIndustryForSlug = (slug: string): IndustryCategory => {
    if (slug.includes('shopify') || slug.includes('woocommerce') || slug.includes('recipe')) return 'ecom';
    if (slug.includes('nextjs') || slug.includes('saas') || slug.includes('yoast')) return 'tech';
    if (slug.includes('medical') || slug.includes('legal') || slug.includes('local') || slug.includes('organization')) return 'local';
    return 'media';
  };

  const allPages = Object.values(PROGRAMMATIC_SEO_PAGES);

  const filteredPages = activeFilter === 'all'
    ? allPages
    : allPages.filter((page) => getIndustryForSlug(page.slug) === activeFilter);

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101a] via-[#090910] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'الدليل الشامل لمخططات السكيما 2026' : 'Complete 2026 Schema Architecture Directory'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'مكتبة السكيما المعتمدة لجميع القطاعات التجارية'
              : 'Enterprise Schema Generators & Rich Snippet Blueprints'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'اختر نوع نشاطك التجاري للحصول على كود سكيما معتمد وفوري لنجوم جوجل واقتباسات الذكاء الاصطناعي.'
              : 'Select your business sector to generate validated JSON-LD schema with zero hydration penalty and live Google star snippet previews.'}
          </p>
        </div>

        {/* Industry Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ar' ? 'الكل (15)' : 'All (15)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('ecom')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'ecom'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ar' ? 'تجارة إلكترونية' : 'E-Commerce'}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('tech')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'tech'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ar' ? 'ساس وتطوير' : 'SaaS & Dev'}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('local')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'local'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ar' ? 'شركات وعيادات' : 'Local & Legal'}
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('media')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'media'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'ar' ? 'ميديا وتعليم' : 'Media & Edu'}
          </button>
        </div>
      </div>

      {/* Schema Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((page) => {
          const Icon = getIconForSlug(page.slug);
          return (
            <Link
              key={page.slug}
              href={`/schema/${page.slug}`}
              className="group p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/[0.04] hover:border-indigo-500/40 transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {page.ctrBoost}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                  {page.badge}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {page.blufSummary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-semibold text-indigo-300 group-hover:text-cyan-300 transition">
                <span>{lang === 'ar' ? 'فتح المولد المباشر' : 'Launch Generator'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
