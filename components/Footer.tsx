'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Bot, Heart, Zap, Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] text-zinc-400 text-xs mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#09090b]">
                  <Layers className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-white text-base">SchemaCraft AI</span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Enterprise-grade JSON-LD structured data engine and AEO optimizer. Client-side AST validation with 0ms latency.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Schema.org v26.0 Compliant</span>
            </div>
          </div>

          {/* Programmatic Schema Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Schema Generators
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/schema/shopify-product" className="hover:text-cyan-400 transition-colors">
                  Shopify Product JSON-LD
                </Link>
              </li>
              <li>
                <Link href="/schema/nextjs-software" className="hover:text-cyan-400 transition-colors">
                  Next.js 15 Software App
                </Link>
              </li>
              <li>
                <Link href="/schema/faq-page" className="hover:text-cyan-400 transition-colors">
                  FAQPage Rich Snippets
                </Link>
              </li>
              <li>
                <Link href="/schema/local-business" className="hover:text-cyan-400 transition-colors">
                  Local Business Maps & NAP
                </Link>
              </li>
              <li>
                <Link href="/schema/article-blog" className="hover:text-cyan-400 transition-colors">
                  Article & Discover News
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs & AEO */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              AEO & AI Search
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-zinc-400">
                <Bot className="h-3 w-3 text-cyan-400" />
                <span>Perplexity Entity Grounding</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-400">
                <Zap className="h-3 w-3 text-indigo-400" />
                <span>ChatGPT Search Optimization</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-400">
                <Terminal className="h-3 w-3 text-emerald-400" />
                <span>0ms Client-Side AST Engine</span>
              </li>
              <li>
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Official Google Rich Test ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Bot Governance Policy */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Bot Access Governance
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              SchemaCraft explicitly authorizes AI crawlers (<code className="text-cyan-300">OAI-SearchBot</code>, <code className="text-cyan-300">PerplexityBot</code>, <code className="text-cyan-300">Google-Extended</code>) for indexing and knowledge grounding.
            </p>
            <div className="pt-1">
              <Link href="/robots.txt" className="text-[11px] text-indigo-400 hover:underline">
                View robots.txt governance ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} SchemaCraft AI & Data Architect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Core Web Vitals: 100/100</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Zero-Friction Single-Utility</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
