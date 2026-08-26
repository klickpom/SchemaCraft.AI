'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Eye,
  Globe,
  Share2,
  Copy,
  Check,
  Sparkles,
  Bot,
  Star,
} from 'lucide-react';

interface SocialCardPreviewerProps {
  lang: Language;
}

type PreviewPlatform = 'google' | 'twitter' | 'linkedin' | 'chatgpt';

export default function SocialCardPreviewer({ lang }: SocialCardPreviewerProps) {
  const [platform, setPlatform] = useState<PreviewPlatform>('google');
  const [title, setTitle] = useState('SchemaCraft AI — Real-Time JSON-LD & AEO Search Auditor');
  const [description, setDescription] = useState(
    'Audit, validate, and optimize your website for ChatGPT Search, Perplexity, and Google 5-Star Rich Snippets with 0ms client-side AST engine.'
  );
  const [url, setUrl] = useState('https://schemacraft-ai.site');
  const [imageUrl, setImageUrl] = useState('https://schemacraft-ai.site/og-image.png');
  const [copied, setCopied] = useState(false);

  const generateMetaHtml = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaHtml());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'محاكي بطاقات السوشيال والبحث' : 'Multi-Platform SERP & Social Card Previewer'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'كيف يظهر موقعك عند المشاركة وفي نتائج البحث؟'
              : 'Live Google SERP & Social Sharing Card Simulator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'شاهد معاينة حية لكيفية ظهور رابط موقعك على جوجل، X (تويتر)، لينكد إن، وبحث الذكاء الاصطناعي مع توليد وسوم Meta Tags.'
              : 'Simulate how your URL renders across Google SERP, Twitter Cards, LinkedIn, and ChatGPT Search citation previews.'}
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
          <button
            type="button"
            onClick={() => setPlatform('google')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              platform === 'google'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google SERP</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('twitter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              platform === 'twitter'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>X / Twitter</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('linkedin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              platform === 'linkedin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('chatgpt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              platform === 'chatgpt'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-300" />
            <span>ChatGPT Search</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'ar' ? 'تعديل وسوم الميتا والمعلومات' : 'Edit Page Meta Information'}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">{lang === 'ar' ? 'عنوان الصفحة (Title):' : 'Page Title:'}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">{lang === 'ar' ? 'وصف الصفحة (Meta Description):' : 'Meta Description:'}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">{lang === 'ar' ? 'رابط الصفحة (Canonical URL):' : 'Canonical URL:'}</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">{lang === 'ar' ? 'رابط صورة المشاركة (OG Image):' : 'OG Image URL:'}</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Right: Real-Time Preview Rendering */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ar' ? 'المعاينة الحية للبطاقة:' : 'Live Render Preview:'}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ وسوم Meta' : 'Copy Meta Tags')}</span>
            </button>
          </div>

          {/* Google SERP Preview */}
          {platform === 'google' && (
            <div className="p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-2 font-sans shadow-lg text-left">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                  🌐
                </div>
                <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">{url}</div>
              </div>
              <h3 className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-[#fbbc04] text-xs">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current text-[#fbbc04]" />
                  ))}
                </div>
                <span className="text-[#bdc1c6] text-[11px] font-mono">4.9 ★★★★★ (328 reviews)</span>
              </div>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Twitter / X Large Card Preview */}
          {platform === 'twitter' && (
            <div className="rounded-2xl bg-black border border-white/15 overflow-hidden shadow-xl text-left">
              <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden flex items-center justify-center border-b border-white/10">
                <img
                  src={imageUrl}
                  alt={title}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white font-mono bg-black/60 px-2 py-1 rounded-md backdrop-blur-md">
                    {url.replace(/^https?:\/\//, '')}
                  </span>
                </div>
              </div>
              <div className="p-3.5 space-y-1 bg-[#0a0a0f]">
                <div className="text-xs font-mono text-slate-400">{url.replace(/^https?:\/\//, '').split('/')[0]}</div>
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{description}</p>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {platform === 'linkedin' && (
            <div className="rounded-2xl bg-[#1b1f23] border border-white/15 overflow-hidden shadow-xl text-left">
              <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1 bg-[#282c31]">
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{title}</h4>
                <div className="text-[11px] font-mono text-slate-400">{url.replace(/^https?:\/\//, '')}</div>
              </div>
            </div>
          )}

          {/* ChatGPT Search Citation Card */}
          {platform === 'chatgpt' && (
            <div className="p-5 rounded-2xl bg-[#171717] border border-white/15 space-y-3 text-left">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
                <Bot className="w-4 h-4" />
                <span>ChatGPT Search Live Reference Card</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Verified Source
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {description}
                </p>
                <div className="text-[10px] font-mono text-cyan-400 pt-1 flex items-center gap-1">
                  <span>Source:</span>
                  <span className="underline">{url}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
