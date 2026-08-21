'use client';

import React, { useState } from 'react';
import { CodeExportFormat, formatCodeForOutput } from '@/lib/schemaTypes';
import { Copy, Check, Download, Minimize2, Maximize2, ExternalLink, Zap, FileCode, Lock } from 'lucide-react';

interface CodePreviewProps {
  schemaObj: object;
  onOpenPaywall?: () => void;
  isPro?: boolean;
}

export function CodePreview({ schemaObj, onOpenPaywall, isPro }: CodePreviewProps) {
  const [format, setFormat] = useState<CodeExportFormat>('html-script');
  const [minified, setMinified] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedCode = formatCodeForOutput(schemaObj, format, minified);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const ext = format === 'html-script' ? 'html' : format === 'nextjs-json' ? 'tsx' : 'json';
    const blob = new Blob([formattedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenGoogleTester = () => {
    const jsonStr = JSON.stringify(schemaObj);
    window.open('https://search.google.com/test/rich-results', '_blank');
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-950/90 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Format Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-3.5 py-2.5 bg-zinc-900/60">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFormat('html-script')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              format === 'html-script'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            HTML &lt;script&gt;
          </button>
          <button
            type="button"
            onClick={() => setFormat('nextjs-json')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              format === 'nextjs-json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Next.js 15 TSX
          </button>
          <button
            type="button"
            onClick={() => setFormat('shopify-liquid')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              format === 'shopify-liquid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Shopify Liquid
          </button>
          <button
            type="button"
            onClick={() => setFormat('wordpress-php')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              format === 'wordpress-php'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            WordPress PHP
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMinified(!minified)}
            className="p-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 transition-colors"
            title={minified ? 'Beautify JSON' : 'Minify JSON'}
          >
            {minified ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Download Schema File"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:opacity-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 p-3.5 bg-[#0a0a0f] overflow-auto max-h-[440px] font-mono text-xs text-zinc-300 select-all">
        <pre className="whitespace-pre leading-relaxed">{formattedCode}</pre>
      </div>

      {/* Footer quick links & Google Tester */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] px-3.5 py-2.5 bg-zinc-900/40 text-xs">
        <button
          type="button"
          onClick={handleOpenGoogleTester}
          className="text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Google Rich Results Test (Official)</span>
        </button>

        <button
          type="button"
          onClick={onOpenPaywall}
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]"
        >
          {isPro ? (
            <span className="text-emerald-400">✓ Batch Export & Webhooks Unlocked</span>
          ) : (
            <>
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Need Batch Site Export or Webhooks? Unlock Pro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
