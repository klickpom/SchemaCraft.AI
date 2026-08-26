'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Video,
  Play,
  Clock,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Film,
  Code2,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';

interface VideoSchemaToolProps {
  lang: Language;
}

interface VideoChapter {
  id: string;
  name: string;
  startOffset: number; // in seconds
}

export default function VideoSchemaTool({ lang }: VideoSchemaToolProps) {
  const [name, setName] = useState('Next.js 15 SEO & AEO Masterclass: Full Implementation');
  const [description, setDescription] = useState(
    'Step-by-step walkthrough on structuring zero-latency JSON-LD schemas and optimizing for ChatGPT Search neural ingestion.'
  );
  const [thumbnailUrl, setThumbnailUrl] = useState('https://schemacraft-ai.site/og-image.png');
  const [uploadDate, setUploadDate] = useState('2026-08-22T10:00:00+00:00');
  const [durationMinutes, setDurationMinutes] = useState('8');
  const [durationSeconds, setDurationSeconds] = useState('45');
  const [embedUrl, setEmbedUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [chapters, setChapters] = useState<VideoChapter[]>([
    { id: '1', name: 'Introduction & Core Web Vitals', startOffset: 0 },
    { id: '2', name: 'Configuring WAF Bot Pass-Through', startOffset: 120 },
    { id: '3', name: 'Synthesizing Multi-Entity Graphs', startOffset: 310 },
  ]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const addChapter = () => {
    const newId = Date.now().toString();
    setChapters((prev) => [
      ...prev,
      { id: newId, name: 'New Chapter Title', startOffset: prev.length * 90 },
    ]);
  };

  const removeChapter = (id: string) => {
    if (chapters.length <= 1) return;
    setChapters((prev) => prev.filter((c) => c.id !== id));
  };

  const updateChapter = (id: string, field: 'name' | 'startOffset', val: any) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const formatOffset = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const generateJsonLdObj = () => {
    const isoDuration = `PT${durationMinutes}M${durationSeconds}S`;
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: name,
      description: description,
      thumbnailUrl: [thumbnailUrl],
      uploadDate: uploadDate,
      duration: isoDuration,
      embedUrl: embedUrl,
      hasPart: chapters.map((c) => ({
        '@type': 'Clip',
        name: c.name,
        startOffset: c.startOffset,
        url: `${embedUrl}?t=${c.startOffset}`,
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-[10px] sm:text-xs font-bold text-rose-300">
            <Film className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'ar' ? 'مولد سكيما الفيديوهات ولحظات البحث الرئيسية' : 'Google VideoObject & Key Moments Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل شريط الفيديو ولحظات التشغيل (Key Moments) في بحث جوجل'
              : 'Unlock Google Video Carousels & Interactive Key Moments'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود VideoObject معتمد يتضمن الفصول الزمنية (Chapters) والمدة والصورة المصغرة لتصدر نتائج بحث الفيديو.'
              : 'Generate structured VideoObject JSON-LD with Clip timestamps to enable interactive chapter navigation directly in Google Video search results.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-rose-300 shrink-0">
          Schema.org/VideoObject
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'بيانات الفيديو والفصول:' : 'Video Metadata & Chapter Markers:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'عنوان الفيديو:' : 'Video Title:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'رابط تضمين الفيديو (Embed URL):' : 'Video Embed URL:'}
              </label>
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'مدة الفيديو (دقيقة : ثانية):' : 'Duration (MM:SS):'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="Minutes"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
                <input
                  type="text"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  placeholder="Seconds"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'رابط الصورة المصغرة (Thumbnail):' : 'Thumbnail Image URL:'}
              </label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-400 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Chapters List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-300 uppercase">
                {lang === 'ar' ? 'الفصول الزمنية (Key Moments):' : 'Interactive Chapter Clips:'}
              </span>
              <button
                type="button"
                onClick={addChapter}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Chapter</span>
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-black/50 border border-white/10"
                >
                  <input
                    type="number"
                    value={chap.startOffset}
                    onChange={(e) => updateChapter(chap.id, 'startOffset', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-cyan-300 font-mono text-center"
                    placeholder="Sec"
                  />
                  <input
                    type="text"
                    value={chap.name}
                    onChange={(e) => updateChapter(chap.id, 'name', e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  />
                  {chapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChapter(chap.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Google Video SERP Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Video Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود الفيديو' : 'Copy Video Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-44 h-28 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center group">
                  <img
                    src={thumbnailUrl}
                    alt={name}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                    {durationMinutes}:{durationSeconds}
                  </span>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                    https://schemacraft-ai.site/videos
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#8ab4f8] leading-snug line-clamp-2 hover:underline cursor-pointer">
                    {name}
                  </h3>
                  <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Key Moments Bar */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>Key Moments in this video:</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {chapters.map((c) => (
                    <div
                      key={c.id}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-rose-500/40 transition shrink-0 space-y-0.5 cursor-pointer"
                    >
                      <div className="text-[10px] font-mono text-rose-400 font-bold">
                        {formatOffset(c.startOffset)}
                      </div>
                      <div className="text-[11px] text-[#e8eaed] font-medium max-w-[130px] truncate">
                        {c.name}
                      </div>
                    </div>
                  ))}
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
