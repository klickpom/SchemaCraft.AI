'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Code2, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenPaywall?: () => void;
  isPro?: boolean;
}

export function Header({ onOpenPaywall, isPro }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090b]">
              <Layers className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">
                SchemaCraft <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                v2.6 AEO
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 tracking-wide">
              0ms JSON-LD AST & Search Simulator
            </span>
          </div>
        </Link>

        {/* Navigation Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/schema/shopify-product" className="hover:text-white transition-colors">
            Shopify E-Com
          </Link>
          <Link href="/schema/nextjs-software" className="hover:text-white transition-colors">
            Next.js 15 SaaS
          </Link>
          <Link href="/schema/saas-faq" className="hover:text-white transition-colors">
            FAQ Expanders
          </Link>
          <Link href="/schema/local-seo-schema" className="hover:text-white transition-colors">
            Local Business
          </Link>
          <Link href="/schema/course-education-schema" className="hover:text-white transition-colors">
            Course & Education
          </Link>
          <Link href="/schema/article-google-discover-schema" className="hover:text-white transition-colors">
            Article / News
          </Link>
        </nav>

        {/* Pro / Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Google Rich Results Ready
          </div>

          <button
            onClick={onOpenPaywall}
            className={`relative inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 ${
              isPro
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white hover:opacity-95 shadow-indigo-500/25 ring-1 ring-indigo-400/30'
            }`}
          >
            {isPro ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-100" />
                <span>Pro Unlocked</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 text-cyan-200" />
                <span>Unlock Pro & Batch</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
