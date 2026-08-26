'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Compass,
  Code2,
  Eye,
  Layers,
} from 'lucide-react';

interface ArticleSchemaToolProps {
  lang: Language;
}

const ARTICLE_TYPES = [
  { id: 'BlogPosting', nameEn: 'Blog Post & Technical Guide', nameAr: 'مقال مدونة ودليل تقني' },
  { id: 'TechArticle', nameEn: 'Technical & Engineering Article', nameAr: 'مقال تقني وبرمجي متقدم' },
  { id: 'NewsArticle', nameEn: 'Google News / Top Stories', nameAr: 'خبر صحفي لـ Google News' },
  { id: 'Article', nameEn: 'General Authority Article', nameAr: 'مقال معرفي عام' },
];

export default function ArticleSchemaTool({ lang }: ArticleSchemaToolProps) {
  const [articleType, setArticleType] = useState('BlogPosting');
  const [headline, setHeadline] = useState('How to Dominate ChatGPT Search and Perplexity with 2026 AEO');
  const [authorName, setAuthorName] = useState('Alex Vance, Principal Data Architect');
  const [authorUrl, setAuthorUrl] = useState('https://x.com/alexvance');
  const [publisherName, setPublisherName] = useState('SchemaCraft AI Labs');
  const [publisherLogo, setPublisherLogo] = useState('https://schemacraft-ai.site/logo.png');
  const [imageUrl, setImageUrl] = useState('https://schemacraft-ai.site/og-image.png');
  const [datePublished, setDatePublished] = useState('2026-08-20T08:00:00+00:00');
  const [dateModified, setDateModified] = useState(new Date().toISOString());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': articleType,
      headline: headline,
      image: [imageUrl],
      datePublished: datePublished,
      dateModified: dateModified,
      author: [
        {
          '@type': 'Person',
          name: authorName,
          url: authorUrl,
        },
      ],
      publisher: {
        '@type': 'Organization',
        name: publisherName,
        logo: {
          '@type': 'ImageObject',
          url: publisherLogo,
        },
      },
      description: `Comprehensive technical guide explaining how modern AI search engines index semantic JSON-LD microdata and citation architecture.`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://schemacraft-ai.site/blog/aeo-guide-2026',
      },
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-[10px] sm:text-xs font-bold text-blue-300">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'ar' ? 'سكيما مقالات جوجل ديسكفر والأخبار' : 'Google Discover & Top Stories Article Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تصدر خلاصات Google Discover ونتائج الأخبار العاجلة'
              : 'Unlock Google Discover Feeds & Top Stories Carousels'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود Article و BlogPosting و NewsArticle معتمد يتضمن إشارات الكاتب الموثق والشعار وتواريخ التحديث لدخول خلاصات جوجل ديسكفر.'
              : 'Generate verified Article, BlogPosting, and NewsArticle microdata required for Google Discover stream eligibility and Top Stories indexing.'}
          </p>
        </div>

        {/* Article Type Selector */}
        <select
          value={articleType}
          onChange={(e) => setArticleType(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-blue-300 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {ARTICLE_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-[#0e0e18] text-white">
              {lang === 'ar' ? t.nameAr : t.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير المقال والمؤلف والناشر:' : 'Article, Author & Publisher Parameters:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'عنوان المقال (Headline):' : 'Article Headline:'}
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم الكاتب / المؤلف:' : 'Author Name (E-E-A-T):'}
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'رابط حساب الكاتب (sameAs):' : 'Author Profile URL:'}
              </label>
              <input
                type="text"
                value={authorUrl}
                onChange={(e) => setAuthorUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم المؤسسة الناشرة:' : 'Publisher Name:'}
              </label>
              <input
                type="text"
                value={publisherName}
                onChange={(e) => setPublisherName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'صورة المقال (16:9 1200px):' : 'Featured Image URL:'}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'تاريخ النشر الأول:' : 'Date Published:'}
              </label>
              <input
                type="text"
                value={datePublished}
                onChange={(e) => setDatePublished(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-indigo-300 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'تاريخ آخر تحديث (Modified):' : 'Date Modified:'}
              </label>
              <input
                type="text"
                value={dateModified}
                onChange={(e) => setDateModified(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-300 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Discover Feed Card Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Discover Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود المقال' : 'Copy Article Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="relative h-44 sm:h-52 rounded-xl bg-slate-900 overflow-hidden border border-white/10">
                <img
                  src={imageUrl}
                  alt={headline}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold border border-white/10">
                  Google Discover Stream
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h3 className="text-base font-bold text-[#e8eaed] leading-snug line-clamp-2 hover:text-[#8ab4f8] cursor-pointer">
                  {headline}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-[#bdc1c6] pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{publisherName}</span>
                    <span>•</span>
                    <span className="text-slate-400">By {authorName.split(',')[0]}</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px]">Updated 2h ago</span>
                </div>
              </div>
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
