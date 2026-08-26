'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Navigation2,
  Code2,
  Eye,
  Globe,
} from 'lucide-react';

interface BreadcrumbSchemaToolProps {
  lang: Language;
}

interface BreadcrumbItem {
  id: string;
  name: string;
  url: string;
}

export default function BreadcrumbSchemaTool({ lang }: BreadcrumbSchemaToolProps) {
  const [items, setItems] = useState<BreadcrumbItem[]>([
    { id: '1', name: 'Home', url: 'https://schemacraft-ai.site' },
    { id: '2', name: 'Schema Architecture', url: 'https://schemacraft-ai.site/schema' },
    { id: '3', name: 'Next.js 15 Software', url: 'https://schemacraft-ai.site/schema/nextjs-software' },
  ]);
  const [pageTitle, setPageTitle] = useState('Next.js 15 Software Application Schema Blueprint');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const addItem = () => {
    const newId = Date.now().toString();
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        name: `Section ${prev.length + 1}`,
        url: `https://schemacraft-ai.site/section-${prev.length + 1}`,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 2) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: 'name' | 'url', val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: item.url,
      })),
    };
  };

  const getJsonLdString = () => {
    return JSON.stringify(generateJsonLdObj(), null, 2);
  };

  const handleCopy = async () => {
    try {
      const code = `<script type="application/ld+json">\n${getJsonLdString()}\n</script>`;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-indigo-300">
            <Navigation2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'سكيما مسار التصفح الهرمي لجوجل' : 'Google BreadcrumbList & Hierarchy Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'استبدل الروابط الطويلة المعقدة بمسار تصفح منسدل وأنيق في نتائج بحث جوجل'
              : 'Replace Raw URLs with Rich Navigable Breadcrumb Trails in SERPs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود BreadcrumbList معتمد لهيكلة مسار الصفحات وتسهيل فهرسة محركات البحث وفهم التسلسل الهرمي لموقعك.'
              : 'Generate Google-compliant BreadcrumbList structured data to structure URL hierarchy and improve search index crawling velocity.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-indigo-300 shrink-0">
          Schema.org/BreadcrumbList
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Trail Builder */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ar' ? 'مستويات المسار الهرمي (Trail Levels):' : 'Hierarchy Trail Steps:'}
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة مستوى' : 'Add Level'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-white/10 bg-black/40 space-y-2 relative group focus-within:border-indigo-500/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    Position #{idx + 1}
                  </span>
                  {items.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Remove level"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Page Name"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                    placeholder="Full URL"
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live SERP Trail Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google SERP Trail</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON-LD Code</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود المسار' : 'Copy Breadcrumb')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-2.5 font-sans shadow-xl text-left">
              {/* Google Breadcrumb Pill Bar */}
              <div className="flex items-center gap-1.5 text-xs text-[#bdc1c6] overflow-x-auto pb-1">
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white shrink-0">
                  🌐
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <span className="hover:underline cursor-pointer text-slate-300">{item.name}</span>
                      {idx < items.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <h3 className="text-base text-[#8ab4f8] font-bold hover:underline cursor-pointer leading-snug">
                {pageTitle}
              </h3>

              <p className="text-xs text-[#bdc1c6] leading-relaxed">
                Structured knowledge graph microdata providing clear categorical relationships for faster crawl budget discovery.
              </p>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[360px]">
              {`<script type="application/ld+json">\n${getJsonLdString()}\n</script>`}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
