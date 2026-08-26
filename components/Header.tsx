'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Terminal,
  ShoppingBag,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenPaywall?: () => void;
  isPro?: boolean;
}

export function Header({ onOpenPaywall, isPro }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schemasOpen, setSchemasOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08080f]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 border border-indigo-400/30 group-hover:scale-105 transition-all bg-[#09090b]">
            <img src="/logo.png" alt="SchemaCraft AI" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-white text-base">
                SchemaCraft <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300 ring-1 ring-inset ring-indigo-500/30 font-mono">
                AEO v2.6
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              0ms AST Engine & Search Simulator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-300 transition-colors">
            Audit Engine
          </Link>

          <div className="relative group">
            <button
              type="button"
              onClick={() => setSchemasOpen(!schemasOpen)}
              onMouseEnter={() => setSchemasOpen(true)}
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors cursor-pointer py-2"
            >
              <span>Schema Generators</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu */}
            <div
              onMouseLeave={() => setSchemasOpen(false)}
              className={`absolute top-full left-0 w-64 rounded-2xl border border-white/15 bg-[#0e0e18] shadow-2xl p-2.5 space-y-1 transition-all duration-200 ${
                schemasOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <Link
                href="/schema/shopify-product"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Shopify E-Com Product</span>
              </Link>
              <Link
                href="/schema/woocommerce-product-schema"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">WooCommerce Product</span>
              </Link>
              <Link
                href="/schema/nextjs-software"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Next.js 15 SaaS App</span>
              </Link>
              <Link
                href="/schema/medical-clinic-doctor-schema"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">Medical & Doctor Clinic</span>
              </Link>
              <Link
                href="/schema/legal-law-firm-schema"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Law Firm & Attorney</span>
              </Link>
              <Link
                href="/schema/wordpress-yoast-alternative-schema"
                onClick={() => setSchemasOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-white transition"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">WordPress Yoast Alternative</span>
              </Link>
            </div>
          </div>

          <Link href="/schema/saas-faq" className="hover:text-cyan-300 transition-colors">
            FAQ Schema
          </Link>
          <Link href="/schema/local-seo-schema" className="hover:text-cyan-300 transition-colors">
            Local SEO Maps
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="https://x.com/SchemaCraftAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition active:scale-95"
            title="Follow @SchemaCraftAI on X"
          >
            <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="hidden sm:inline text-[11px] font-mono">@SchemaCraftAI</span>
          </a>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenPaywall}
            className={`transition px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0 ${
              isPro
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white hover:opacity-95 shadow-indigo-500/25'
            }`}
          >
            {isPro ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                <span>Pro Active</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 text-cyan-200" />
                <span>Unlock All ($9)</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0c0c16] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl bg-white/[0.04] text-xs font-bold text-white hover:bg-white/[0.08]"
          >
            🚀 Run AI Search Audit
          </Link>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1">
            Top Schema Generators
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Link
              href="/schema/shopify-product"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              Shopify Product
            </Link>
            <Link
              href="/schema/woocommerce-product-schema"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              WooCommerce
            </Link>
            <Link
              href="/schema/nextjs-software"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              Next.js 15 SaaS
            </Link>
            <Link
              href="/schema/medical-clinic-doctor-schema"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              Medical Clinic
            </Link>
            <Link
              href="/schema/legal-law-firm-schema"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              Law Firm
            </Link>
            <Link
              href="/schema/wordpress-yoast-alternative-schema"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl bg-white/[0.03] text-[11px] text-slate-300 hover:text-white"
            >
              Yoast Alternative
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
