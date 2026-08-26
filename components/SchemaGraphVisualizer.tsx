'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Layers,
  Network,
  Sparkles,
  Building2,
  Terminal,
  ShoppingBag,
  Star,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface SchemaGraphVisualizerProps {
  lang: Language;
}

type NodeId = 'organization' | 'software' | 'offer' | 'rating' | 'faq' | 'breadcrumb';

interface GraphNode {
  id: NodeId;
  nameEn: string;
  nameAr: string;
  type: string;
  icon: any;
  color: string;
  descEn: string;
  descAr: string;
  snippet: string;
  googleRoleEn: string;
  googleRoleAr: string;
}

const NODES: Record<NodeId, GraphNode> = {
  organization: {
    id: 'organization',
    nameEn: 'Brand Entity (Root)',
    nameAr: 'كيان العلامة التجارية (الجذر)',
    type: 'schema:Organization',
    icon: Building2,
    color: 'from-indigo-500 to-cyan-500',
    descEn: 'Declares corporate identity, verified logo, and official sameAs social profiles for Google Knowledge Panel.',
    descAr: 'يوثق هوية الشركة، الشعار الرسمي، وحسابات التواصل المعتمدة للوحة المعرفة الرسمية في جوجل.',
    googleRoleEn: 'Builds Google Knowledge Graph Authority',
    googleRoleAr: 'يبني سلطة لوحة المعرفة في جوجل',
    snippet: `{\n  "@type": "Organization",\n  "@id": "https://example.com/#org",\n  "name": "Acme Systems",\n  "logo": "https://example.com/logo.png",\n  "sameAs": ["https://x.com/acme", "https://linkedin.com/company/acme"]\n}`,
  },
  software: {
    id: 'software',
    nameEn: 'Core Software / App',
    nameAr: 'التطبيق أو الساس الأساسي',
    type: 'schema:SoftwareApplication',
    icon: Terminal,
    color: 'from-cyan-500 to-blue-600',
    descEn: 'Defines operating system, software category, and connects to publisher entity via @id.',
    descAr: 'يحدد نظام التشغيل، الفئة البرمجية، ويرتبط بكيان الشركة الناشرة عبر المعرف @id.',
    googleRoleEn: 'Unlocks App SERP Snippets & AI Categorization',
    googleRoleAr: 'يظهر بطاقات التطبيقات في بحث جوجل والذكاء الاصطناعي',
    snippet: `{\n  "@type": "SoftwareApplication",\n  "name": "Acme AI Suite",\n  "applicationCategory": "DeveloperApplication",\n  "publisher": { "@id": "https://example.com/#org" }\n}`,
  },
  offer: {
    id: 'offer',
    nameEn: 'Commercial Offer',
    nameAr: 'العرض التجاري والأسعار',
    type: 'schema:Offer',
    icon: ShoppingBag,
    color: 'from-emerald-500 to-teal-600',
    descEn: 'Provides verified pricing, currency, and real-time InStock availability to trigger SERP price badges.',
    descAr: 'يقدم الأسعار الدقيقة والعملة وحالة التوفر المباشر لإظهار شارات الأسعار في نتائج البحث.',
    googleRoleEn: 'Triggers SERP Price Badges & Merchant Feeds',
    googleRoleAr: 'يظهر شارات الأسعار وتوفر المخزون في جوجل',
    snippet: `{\n  "@type": "Offer",\n  "price": "9.00",\n  "priceCurrency": "USD",\n  "availability": "https://schema.org/InStock"\n}`,
  },
  rating: {
    id: 'rating',
    nameEn: 'Aggregate Star Rating',
    nameAr: 'تقييمات النجوم الذهبية',
    type: 'schema:AggregateRating',
    icon: Star,
    color: 'from-amber-500 to-orange-600',
    descEn: 'Aggregates genuine verified customer reviews to render the coveted 5-star gold review snippet in organic SERPs.',
    descAr: 'يجمع مصفوفة تقييمات العملاء الموثقة لإظهار نجوم جوجل الذهبية الخمسة في نتائج البحث.',
    googleRoleEn: 'Renders 5-Star Gold Review Snippets in SERP',
    googleRoleAr: 'يظهر نجوم التقييم الذهبية في نتائج بحث جوجل',
    snippet: `{\n  "@type": "AggregateRating",\n  "ratingValue": "4.9",\n  "reviewCount": "328",\n  "bestRating": "5"\n}`,
  },
  faq: {
    id: 'faq',
    nameEn: 'FAQ Question Matrix',
    nameAr: 'مصفوفة الأسئلة الشائعة',
    type: 'schema:FAQPage',
    icon: HelpCircle,
    color: 'from-purple-500 to-pink-600',
    descEn: 'Embeds authoritative direct answers to expand SERP vertical footprint and dominate conversational search.',
    descAr: 'يضمن إجابات مباشرة وموثقة لمضاعفة المساحة البصرية في جوجل وتغذية محركات الذكاء الاصطناعي.',
    googleRoleEn: 'Expands Vertical SERP Real Estate by 200%',
    googleRoleAr: 'يضاعف مساحة الظهور البصري في جوجل بنسبة 200%',
    snippet: `{\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "How fast is indexing?",\n    "acceptedAnswer": { "@type": "Answer", "text": "Under 12 hours via IndexNow." }\n  }]\n}`,
  },
  breadcrumb: {
    id: 'breadcrumb',
    nameEn: 'Breadcrumb Navigation',
    nameAr: 'مسار التصفح الهرمي',
    type: 'schema:BreadcrumbList',
    icon: Layers,
    color: 'from-rose-500 to-red-600',
    descEn: 'Structures site hierarchy (Home > Tools > Generator) to replace raw ugly URLs with clean navigable breadcrumb pills in SERPs.',
    descAr: 'يهيكل مسار الصفحات لاستبدال الروابط العادية بمسار تصفح منسدل وأنيق في نتائج البحث.',
    googleRoleEn: 'Replaces Raw URLs with Rich Breadcrumb Pills',
    googleRoleAr: 'يستبدل الروابط التقليدية بمسار تصفح ذكي',
    snippet: `{\n  "@type": "BreadcrumbList",\n  "itemListElement": [{\n    "@type": "ListItem",\n    "position": 1,\n    "name": "Home",\n    "item": "https://example.com"\n  }]\n}`,
  },
};

export default function SchemaGraphVisualizer({ lang }: SchemaGraphVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<NodeId>('organization');

  const active = NODES[selectedNode];

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'مستكشف شبكة الكيانات المعرفية' : 'Interactive Knowledge Graph Explorer'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'كيف تفهم محركات الذكاء الاصطناعي وجوجل ترابط موقعك؟'
              : 'How Modern AI Search & Google Ingest Multi-Entity Graphs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'انقر على أي عقدة (Node) لمعرفة كيفية ترابط كيانات السكيما لتكوين رسم بياني معرفي موثق.'
              : 'Click any connected node to see how Schema.org graphs link organizations, products, reviews, and FAQs into a unified semantic graph.'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 shrink-0">
          @graph [6 Connected Nodes]
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Node Selection Grid */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'ar' ? 'العقد المعرفية في شبكة الموقع' : 'Knowledge Graph Entity Nodes'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(NODES) as NodeId[]).map((key) => {
              const node = NODES[key];
              const Icon = node.icon;
              const isSelected = selectedNode === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedNode(key)}
                  className={`p-4 rounded-2xl border text-left rtl:text-right transition cursor-pointer flex items-start gap-3 relative overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-500/80 bg-indigo-950/40 shadow-lg shadow-indigo-950/60'
                      : 'border-white/10 bg-black/30 hover:bg-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {lang === 'ar' ? node.nameAr : node.nameEn}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {node.type}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 h-2 w-2 rounded-full bg-cyan-400 animate-ping"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Node Inspector */}
        <div className="lg:col-span-6 space-y-4 p-6 rounded-3xl border border-white/15 bg-black/70 shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center text-white shadow-lg`}
              >
                {React.createElement(active.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {lang === 'ar' ? active.nameAr : active.nameEn}
                </h3>
                <span className="text-[11px] font-mono text-cyan-300">{active.type}</span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {lang === 'ar' ? active.googleRoleAr : active.googleRoleEn}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ar' ? active.descAr : active.descEn}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'نموذج الكود داخل الـ Graph:' : 'Nested JSON-LD Structure:'}</span>
            </div>
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {active.snippet}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
