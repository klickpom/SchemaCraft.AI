'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SchemaCategory, SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import { validateSchemaAST } from '@/lib/validator';
import { VisualFormBuilder } from './VisualFormBuilder';
import { RawExtractor } from './RawExtractor';
import { ValidationBadge } from './ValidationBadge';
import { CodePreview } from './CodePreview';
import { SerpPreview } from './SerpPreview';
import { PaywallModal } from './PaywallModal';
import { BatchModal } from './BatchModal';
import { isProUnlockedClient } from '@/lib/payment';
import {
  Sparkles,
  Layers,
  Terminal,
  ShoppingBag,
  HelpCircle,
  MapPin,
  FileText,
  Building2,
  Star,
  Wand2,
  Eye,
  Code2,
  FileArchive,
  CheckCircle2,
} from 'lucide-react';

interface SchemaBuilderProps {
  initialCategory?: SchemaCategory;
  initialValuesOverride?: Record<string, any>;
}

const CATEGORY_ICONS: Record<SchemaCategory, React.ReactNode> = {
  SoftwareApplication: <Terminal className="h-4 w-4" />,
  Product: <ShoppingBag className="h-4 w-4" />,
  FAQPage: <HelpCircle className="h-4 w-4" />,
  LocalBusiness: <MapPin className="h-4 w-4" />,
  Article: <FileText className="h-4 w-4" />,
  HowTo: <Layers className="h-4 w-4" />,
  Organization: <Building2 className="h-4 w-4" />,
  Review: <Star className="h-4 w-4" />,
};

export function SchemaBuilder({
  initialCategory = 'SoftwareApplication',
  initialValuesOverride,
}: SchemaBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<SchemaCategory>(initialCategory);
  const [workspaceMode, setWorkspaceMode] = useState<'visual' | 'extractor'>('visual');
  const [rightPanelTab, setRightPanelTab] = useState<'code' | 'preview'>('code');

  // Form State keyed by category
  const [formStates, setFormStates] = useState<Record<SchemaCategory, Record<string, any>>>(() => {
    const states: Record<string, any> = {};
    (Object.keys(SCHEMA_DEFINITIONS) as SchemaCategory[]).forEach((cat) => {
      states[cat] = { ...SCHEMA_DEFINITIONS[cat].defaultValues };
    });
    if (initialValuesOverride && initialCategory) {
      states[initialCategory] = { ...states[initialCategory], ...initialValuesOverride };
    }
    return states as Record<SchemaCategory, Record<string, any>>;
  });

  // Pro & Modal States
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isProUnlocked, setIsProUnlocked] = useState(false);

  useEffect(() => {
    setIsProUnlocked(isProUnlockedClient());
  }, []);

  const currentValues = formStates[activeCategory] || SCHEMA_DEFINITIONS[activeCategory].defaultValues;

  const handleValuesChange = (newValues: Record<string, any>) => {
    setFormStates((prev) => ({
      ...prev,
      [activeCategory]: newValues,
    }));
  };

  const handleExtracted = (detectedType: SchemaCategory, parsedValues: Record<string, any>) => {
    setActiveCategory(detectedType);
    setFormStates((prev) => ({
      ...prev,
      [detectedType]: {
        ...SCHEMA_DEFINITIONS[detectedType].defaultValues,
        ...parsedValues,
      },
    }));
    setWorkspaceMode('visual');
  };

  // Generate real-time JSON-LD AST object
  const schemaJsonObj = useMemo(() => {
    const def = SCHEMA_DEFINITIONS[activeCategory];
    return def.generateJsonLd(currentValues);
  }, [activeCategory, currentValues]);

  // Validate AST in real-time
  const validationResult = useMemo(() => {
    return validateSchemaAST(schemaJsonObj);
  }, [schemaJsonObj]);

  return (
    <div className="space-y-6">
      {/* Workspace Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        {/* Workspace Mode Switcher (Visual vs Raw Extractor) */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08] self-start">
          <button
            type="button"
            onClick={() => setWorkspaceMode('visual')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              workspaceMode === 'visual'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Visual Form Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setWorkspaceMode('extractor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              workspaceMode === 'extractor'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Raw Code &amp; URL Extractor</span>
          </button>
        </div>

        {/* Pro Triggers & Batch Export Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBatchOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors shadow-sm"
          >
            <FileArchive className="h-3.5 w-3.5 text-cyan-400" />
            <span>Batch Site Schemas (@graph)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaywallOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              isProUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08]'
            }`}
          >
            {isProUnlocked ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Pro Active</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Unlock Dynamic Scripts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Schema Category Selection Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider text-zinc-300">
            Select Schema.org Entity Type:
          </span>
          <span className="text-[11px] text-zinc-400">0ms Real-Time Synthesis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {(Object.keys(SCHEMA_DEFINITIONS) as SchemaCategory[]).map((catKey) => {
            const isSelected = activeCategory === catKey;
            const def = SCHEMA_DEFINITIONS[catKey];
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center group ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'border-white/[0.06] bg-zinc-900/40 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mb-1.5 transition-transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {CATEGORY_ICONS[catKey]}
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-1">
                  {def.name.split('/')[0]}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5 scale-90">
                  {def.googleRichResultType.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split-View Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Builder / Extractor + Real-Time AST Validation (7 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {CATEGORY_ICONS[activeCategory]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {SCHEMA_DEFINITIONS[activeCategory].name}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Schema.org/{activeCategory} Specification
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-mono text-emerald-400">Live 0ms AST</span>
              </div>
            </div>

            {/* Content: Visual Form OR Raw Extractor */}
            {workspaceMode === 'visual' ? (
              <VisualFormBuilder
                category={activeCategory}
                values={currentValues}
                onChange={handleValuesChange}
              />
            ) : (
              <RawExtractor onExtracted={handleExtracted} />
            )}
          </div>

          {/* AST Validation & Google Compliance Scoring */}
          <ValidationBadge validation={validationResult} />
        </div>

        {/* Right Column: Code Preview & Live SERP / AIO Simulator (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Top Preview Mode Switcher */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900/80 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setRightPanelTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  rightPanelTab === 'code'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>JSON-LD Code</span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  rightPanelTab === 'preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live SERP &amp; AIO Simulation</span>
              </button>
            </div>

            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              1-Click Copy Ready
            </span>
          </div>

          {/* Right Panel View */}
          {rightPanelTab === 'code' ? (
            <CodePreview
              schemaObj={schemaJsonObj}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              isPro={isProUnlocked}
            />
          ) : (
            <SerpPreview
              category={activeCategory}
              values={currentValues}
              schemaObj={schemaJsonObj}
            />
          )}

          {/* Quick Dual Mini View if Code is selected: Embed quick SERP preview underneath */}
          {rightPanelTab === 'code' && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="h-3 w-3 text-cyan-400" /> Instant SERP Preview Mini:
                </span>
                <button
                  type="button"
                  onClick={() => setRightPanelTab('preview')}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Full Simulator ↗
                </button>
              </div>
              <SerpPreview
                category={activeCategory}
                values={currentValues}
                schemaObj={schemaJsonObj}
              />
            </div>
          )}
        </div>
      </div>

      {/* Pro Modals */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={() => {
          setIsProUnlocked(true);
        }}
      />

      <BatchModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        isPro={isProUnlocked}
        onOpenPaywall={() => {
          setIsBatchOpen(false);
          setIsPaywallOpen(true);
        }}
      />
    </div>
  );
}
