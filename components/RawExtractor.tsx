'use client';

import React, { useState } from 'react';
import { SchemaCategory } from '@/lib/schemaTypes';
import { extractSchemaFromInput, EXTRACTOR_PRESETS } from '@/lib/extractor';
import { Sparkles, ArrowRight, Wand2, FileCode, CheckCircle2 } from 'lucide-react';

interface RawExtractorProps {
  onExtracted: (type: SchemaCategory, values: Record<string, any>) => void;
}

export function RawExtractor({ onExtracted }: RawExtractorProps) {
  const [inputText, setInputText] = useState('');
  const [lastExtractedMsg, setLastExtractedMsg] = useState<string | null>(null);

  const handleParse = (textToParse?: string) => {
    const text = textToParse !== undefined ? textToParse : inputText;
    if (!text.trim()) return;

    const result = extractSchemaFromInput(text);
    onExtracted(result.detectedType, result.parsedValues);
    setLastExtractedMsg(`Auto-detected: ${result.detectedType} (${result.rawConfidence}% confidence) — ${result.summary}`);
  };

  const handlePreset = (preset: typeof EXTRACTOR_PRESETS[0]) => {
    setInputText(preset.snippet);
    handleParse(preset.snippet);
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="rounded-lg bg-cyan-950/20 border border-cyan-500/20 p-3 flex items-start gap-2.5">
        <Wand2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-cyan-300">
            Intelligent AST Parser & Schema Extractor
          </p>
          <p className="text-zinc-400 mt-0.5">
            Paste raw JSON, OpenGraph meta tags, Q&A text, or product specs. Our client-side parser synthesizes clean, valid JSON-LD in 0ms.
          </p>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" /> Or test with 1-click sample presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {EXTRACTOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePreset(preset)}
              className="text-[11px] rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-indigo-500/10 hover:border-indigo-500/30 px-2.5 py-1.5 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <FileCode className="h-3 w-3 text-cyan-400" />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Paste anything here:
• Messy HTML meta tags (<meta property="og:title" ...>)
• Raw JSON or existing schema
• Unstructured FAQs or product text descriptions...`}
          className="w-full rounded-xl glass-input p-3 text-xs text-zinc-200 placeholder-zinc-500 font-mono resize-none focus:ring-1 focus:ring-cyan-500"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleParse()}
            disabled={!inputText.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Parse & Build Schema</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {lastExtractedMsg && (
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-xs sm:max-w-md">{lastExtractedMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
