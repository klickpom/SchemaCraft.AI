'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Sparkles,
  Search,
  HelpCircle,
  MapPin,
  ShoppingBag,
  FileText,
  Video,
  Navigation2,
  ListOrdered,
  Calendar,
  GraduationCap,
  Utensils,
  Layers,
  CheckCircle2,
} from 'lucide-react';

import FaqGeneratorTool from '@/components/FaqGeneratorTool';
import LocalBusinessSchemaTool from '@/components/LocalBusinessSchemaTool';
import ProductSchemaTool from '@/components/ProductSchemaTool';
import ArticleSchemaTool from '@/components/ArticleSchemaTool';
import VideoSchemaTool from '@/components/VideoSchemaTool';
import BreadcrumbSchemaTool from '@/components/BreadcrumbSchemaTool';
import HowToSchemaTool from '@/components/HowToSchemaTool';
import EventSchemaTool from '@/components/EventSchemaTool';
import CourseSchemaTool from '@/components/CourseSchemaTool';
import RecipeSchemaTool from '@/components/RecipeSchemaTool';

interface SchemaStudioSuiteProps {
  lang: Language;
}

interface ToolMeta {
  id: string;
  nameEn: string;
  nameAr: string;
  badgeEn: string;
  badgeAr: string;
  icon: any;
  category: 'ecommerce' | 'local' | 'content' | 'rich_serp';
}

const TOOLS: ToolMeta[] = [
  {
    id: 'faq',
    nameEn: 'FAQPage & SERP Dropdowns',
    nameAr: 'الأسئلة الشائعة وقوائم جوجل',
    badgeEn: '200% SERP Area',
    badgeAr: 'مضاعفة المساحة 200%',
    icon: HelpCircle,
    category: 'rich_serp',
  },
  {
    id: 'product',
    nameEn: 'E-Commerce & Google Merchant',
    nameAr: 'المنتجات وجوجل للتسوق',
    badgeEn: '5-Star Ratings & Stock',
    badgeAr: 'نجوم التقييم والمخزون',
    icon: ShoppingBag,
    category: 'ecommerce',
  },
  {
    id: 'local',
    nameEn: 'Local SEO & Google Maps 3-Pack',
    nameAr: 'السيو المحلي وخرائط جوجل',
    badgeEn: 'NAP & Geo Coordinates',
    badgeAr: 'العنوان والهاتف والخرائط',
    icon: MapPin,
    category: 'local',
  },
  {
    id: 'article',
    nameEn: 'Google Discover & News Articles',
    nameAr: 'مقالات جوجل ديسكفر والأخبار',
    badgeEn: 'E-E-A-T Author Authority',
    badgeAr: 'توثيق الكاتب والناشر',
    icon: FileText,
    category: 'content',
  },
  {
    id: 'video',
    nameEn: 'VideoObject & Key Moments',
    nameAr: 'الفيديوهات ولحظات البحث',
    badgeEn: 'Interactive Chapters',
    badgeAr: 'فصول الفيديو التفاعلية',
    icon: Video,
    category: 'rich_serp',
  },
  {
    id: 'breadcrumb',
    nameEn: 'BreadcrumbList Hierarchy',
    nameAr: 'مسار التصفح الهرمي',
    badgeEn: 'Clean Google SERP Trails',
    badgeAr: 'مسار تصفح أنيق',
    icon: Navigation2,
    category: 'rich_serp',
  },
  {
    id: 'howto',
    nameEn: 'HowTo Step-by-Step Guides',
    nameAr: 'الشروحات والخطوات المرقمة',
    badgeEn: 'Numbered SERP Cards',
    badgeAr: 'بطاقات إرشادية مرقمة',
    icon: ListOrdered,
    category: 'content',
  },
  {
    id: 'event',
    nameEn: 'Events & Ticket Booking',
    nameAr: 'الفعاليات وحجز التذاكر',
    badgeEn: 'Direct Ticket Booking',
    badgeAr: 'شراء التذاكر المباشر',
    icon: Calendar,
    category: 'local',
  },
  {
    id: 'course',
    nameEn: 'Course & Accreditations',
    nameAr: 'الدورات والشهادات المعتمدة',
    badgeEn: 'Credential Certification',
    badgeAr: 'شهادات مهنية معتمدة',
    icon: GraduationCap,
    category: 'content',
  },
  {
    id: 'recipe',
    nameEn: 'Recipe & Culinary Nutrition',
    nameAr: 'الوصفات والقيم الغذائية',
    badgeEn: 'Calories & Cook Times',
    badgeAr: 'السعرات ومدة الطهي',
    icon: Utensils,
    category: 'content',
  },
];

export default function SchemaStudioSuite({ lang }: SchemaStudioSuiteProps) {
  const [activeToolId, setActiveToolId] = useState<string>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.nameAr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="schema-studio-suite" className="space-y-6 scroll-mt-24">
      {/* Studio Header Card */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-[#121226] via-[#0d0d1a] to-[#080810] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-indigo-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ar' ? 'استوديو السكيما التفاعلي الشامل' : 'Interactive Schema Studio Suite (10 Specialized Engines)'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ar'
                ? 'استوديو توليد السكيما المتقدم لكافة الأنشطة والقطاعات'
                : 'Enterprise Schema & Rich Result Generators Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {lang === 'ar'
                ? 'اختر الأداة المناسبة لموقعك لتوليد كود السكيما المعتمد، ومعاينته الحية فوراً على نتائج بحث جوجل والذكاء الاصطناعي.'
                : 'Select any specialized microdata engine below to construct, preview, and export 100% compliant structured JSON-LD with 0ms latency.'}
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في الأدوات...' : 'Search tools...'}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', en: 'All 10 Tools', ar: 'جميع الأدوات (10)' },
            { id: 'rich_serp', en: 'SERP & Media', ar: 'نتائج البحث والوسائط' },
            { id: 'ecommerce', en: 'E-Commerce', ar: 'التجارة الإلكترونية' },
            { id: 'local', en: 'Local & Events', ar: 'السيو المحلي والفعاليات' },
            { id: 'content', en: 'Content & Education', ar: 'المحتوى والتعليم' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {lang === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Tool Selection Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeToolId === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveToolId(tool.id)}
                className={`p-3 rounded-2xl border text-left rtl:text-right transition flex flex-col justify-between gap-2 cursor-pointer active:scale-95 group ${
                  isActive
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-950/70 to-indigo-900/30 text-white shadow-lg shadow-indigo-950/50'
                    : 'border-white/10 bg-black/40 hover:bg-white/[0.04] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-2 rounded-xl border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-indigo-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-xs truncate leading-snug">
                    {lang === 'ar' ? tool.nameAr : tool.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {lang === 'ar' ? tool.badgeAr : tool.badgeEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Tool Smoothly */}
      <div className="transition-all duration-300">
        {activeToolId === 'faq' && <FaqGeneratorTool lang={lang} />}
        {activeToolId === 'product' && <ProductSchemaTool lang={lang} />}
        {activeToolId === 'local' && <LocalBusinessSchemaTool lang={lang} />}
        {activeToolId === 'article' && <ArticleSchemaTool lang={lang} />}
        {activeToolId === 'video' && <VideoSchemaTool lang={lang} />}
        {activeToolId === 'breadcrumb' && <BreadcrumbSchemaTool lang={lang} />}
        {activeToolId === 'howto' && <HowToSchemaTool lang={lang} />}
        {activeToolId === 'event' && <EventSchemaTool lang={lang} />}
        {activeToolId === 'course' && <CourseSchemaTool lang={lang} />}
        {activeToolId === 'recipe' && <RecipeSchemaTool lang={lang} />}
      </div>
    </div>
  );
}
