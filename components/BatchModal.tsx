'use client';

import React, { useState } from 'react';
import { SchemaCategory, SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import { X, Layers, Download, Check, Sparkles, Lock, ArrowRight, FileArchive, CheckCircle2 } from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onOpenPaywall: () => void;
}

export function BatchModal({ isOpen, onClose, isPro, onOpenPaywall }: BatchModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<SchemaCategory[]>([
    'SoftwareApplication',
    'Product',
    'FAQPage',
    'Organization',
  ]);
  const [copiedBatch, setCopiedBatch] = useState(false);

  if (!isOpen) return null;

  const toggleType = (type: SchemaCategory) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const batchGraph = {
    '@context': 'https://schema.org',
    '@graph': selectedTypes.map((type) => {
      const def = SCHEMA_DEFINITIONS[type];
      const json = def.generateJsonLd(def.defaultValues) as any;
      const { ['@context']: _, ...rest } = json;
      return rest;
    }),
  };

  const batchJsonString = JSON.stringify(batchGraph, null, 2);

  const handleCopyBatch = async () => {
    if (!isPro) {
      onOpenPaywall();
      return;
    }
    await navigator.clipboard.writeText(batchJsonString);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const handleDownloadZip = () => {
    if (!isPro) {
      onOpenPaywall();
      return;
    }
    const blob = new Blob([batchJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schemacraft-all-site-schemas.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0c0c12] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Page Batch Schema Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Export Unified @graph Structured Architecture
            </h3>
            <p className="text-xs text-zinc-400">
              Select the schema nodes you want to bundle into a single consolidated, high-performance Schema.org @graph entity payload.
            </p>
          </div>

          {/* Selectable Schema Nodes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300">Select Active Schemas to Include:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SCHEMA_DEFINITIONS) as SchemaCategory[]).map((type) => {
                const isSelected = selectedTypes.includes(type);
                const def = SCHEMA_DEFINITIONS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`rounded-lg border p-2 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                        : 'border-white/[0.06] bg-black/40 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{def.name.split('/')[0]}</span>
                      {isSelected && <Check className="h-3 w-3 text-cyan-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code preview with blur lock if not pro */}
          <div className="relative rounded-xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden">
            <div className="px-3.5 py-2 border-b border-white/[0.06] bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono">unified-site-graph.json-ld</span>
              <span>{selectedTypes.length} Schemas in @graph</span>
            </div>

            <div className="p-3 max-h-48 overflow-y-auto font-mono text-[11px] text-zinc-300 whitespace-pre">
              {batchJsonString}
            </div>

            {!isPro && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                <Lock className="h-8 w-8 text-cyan-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Pro Batch Export Feature</h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-3">
                  Unlock unlimited batch downloads, dynamic variable scripts, and automated CMS bundles.
                </p>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Unlock Instant Batch ($4.99)</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Full Schema.org @graph graph-linked structure</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBatch}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white transition-colors"
              >
                {copiedBatch ? 'Copied Graph!' : 'Copy @graph JSON'}
              </button>

              <button
                type="button"
                onClick={handleDownloadZip}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
              >
                <FileArchive className="h-3.5 w-3.5" />
                <span>Download Batch Bundle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
