'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Language } from '@/lib/translations';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import {
  Search,
  X,
  Zap,
  Terminal,
  ShieldCheck,
  ShoppingBag,
  FileCode2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectAudit?: (url: string) => void;
}

export default function CommandPalette({
  lang,
  isOpen,
  onClose,
  onSelectAudit,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allSchemas = Object.values(PROGRAMMATIC_SEO_PAGES);

  const filteredSchemas = query.trim() === ''
    ? allSchemas
    : allSchemas.filter(
        (s) =>
          s.badge.toLowerCase().includes(query.toLowerCase()) ||
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.slug.toLowerCase().includes(query.toLowerCase())
      );

  const handleNavigate = (slug: string) => {
    router.push(`/schema/${slug}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-[#0e0e16] shadow-2xl shadow-black/90 overflow-hidden space-y-3 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث عن أي نوع سكيما أو مولد (مثال: Shopify, Medical, Video)...'
                : 'Search schemas, tools, or frameworks (e.g. Shopify, Medical, Next.js)...'
            }
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-medium"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-1 pr-1">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {lang === 'ar' ? 'المولدات ومخططات السكيما المتاحة' : 'Available Schema Generators & Blueprints'}
          </div>

          {filteredSchemas.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك.' : 'No matching schemas found.'}
            </div>
          ) : (
            filteredSchemas.map((schema) => (
              <button
                key={schema.slug}
                type="button"
                onClick={() => handleNavigate(schema.slug)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left rtl:text-right transition group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {schema.badge}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      /schema/{schema.slug}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {schema.ctrBoost}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span>{lang === 'ar' ? 'التنقل الفوري عبر المنصة' : 'Quick Navigation Palette'}</span>
          <span className="font-mono text-[10px]">SchemaCraft.AI v1.0</span>
        </div>
      </div>
    </div>
  );
}
