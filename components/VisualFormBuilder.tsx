'use client';

import React from 'react';
import { SchemaCategory, SCHEMA_DEFINITIONS, SchemaFieldConfig } from '@/lib/schemaTypes';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

interface VisualFormBuilderProps {
  category: SchemaCategory;
  values: Record<string, any>;
  onChange: (newValues: Record<string, any>) => void;
}

export function VisualFormBuilder({ category, values, onChange }: VisualFormBuilderProps) {
  const currentDef = SCHEMA_DEFINITIONS[category];

  const handleFieldChange = (fieldId: string, val: any) => {
    onChange({
      ...values,
      [fieldId]: val,
    });
  };

  // FAQ Array management
  const faqs = values.faqs || [];
  const handleFaqChange = (index: number, key: 'question' | 'answer', text: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: text };
    handleFieldChange('faqs', updated);
  };
  const handleAddFaq = () => {
    handleFieldChange('faqs', [
      ...faqs,
      { question: 'What is the implementation timeline?', answer: 'Structured data updates immediately upon deployment.' },
    ]);
  };
  const handleRemoveFaq = (index: number) => {
    const updated = faqs.filter((_: any, i: number) => i !== index);
    handleFieldChange('faqs', updated);
  };

  // HowTo Steps Array management
  const steps = values.steps || [];
  const handleStepChange = (index: number, key: 'name' | 'text', text: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [key]: text };
    handleFieldChange('steps', updated);
  };
  const handleAddStep = () => {
    handleFieldChange('steps', [
      ...steps,
      { name: `Step ${steps.length + 1}`, text: 'Execute step instructions.' },
    ]);
  };
  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_: any, i: number) => i !== index);
    handleFieldChange('steps', updated);
  };

  return (
    <div className="space-y-4">
      {/* Category Info Header */}
      <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-3.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-300">
            {currentDef.googleRichResultType} Target
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {currentDef.description}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-500/30 font-mono">
          {currentDef.badge}
        </span>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentDef.fields.map((field: SchemaFieldConfig) => {
          if (field.type === 'array-faq') {
            return (
              <div key={field.id} className="sm:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>Q&amp;A Questions &amp; Answers ({faqs.length})</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-2.5 py-1 rounded-xl transition-all font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Question
                  </button>
                </div>

                <div className="space-y-2.5">
                  {faqs.map((faq: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 relative group focus-within:border-indigo-500/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">
                          QUESTION #{idx + 1}
                        </span>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove Question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        placeholder="e.g. How does this service work?"
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer || ''}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        placeholder="Detailed answer text..."
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (field.type === 'array-howto') {
            return (
              <div key={field.id} className="sm:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>HowTo Step Sequence ({steps.length})</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-2.5 py-1 rounded-xl transition-all font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Step
                  </button>
                </div>

                <div className="space-y-2.5">
                  {steps.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 relative group focus-within:border-indigo-500/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">
                          STEP #{idx + 1}
                        </span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove Step"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={step.name || ''}
                        onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                        placeholder="Step title (e.g. Initialize project)"
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <textarea
                        rows={2}
                        value={step.text || ''}
                        onChange={(e) => handleStepChange(idx, 'text', e.target.value)}
                        placeholder="Detailed instructions for this step..."
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const isFullWidth = field.type === 'textarea' || field.id === 'name' || field.id === 'headline' || field.id === 'description' || field.id === 'sameAs';

          return (
            <div
              key={field.id}
              className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                {field.help && (
                  <span className="text-[10px] text-slate-500 cursor-help" title={field.help}>
                    <HelpCircle className="h-3 w-3 inline text-slate-400" />
                  </span>
                )}
              </div>

              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={values[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-black/90 resize-none font-medium transition-all shadow-inner"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.id] || field.options?.[0]}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-black/90 font-medium transition-all shadow-inner cursor-pointer"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0e0e18] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={values[field.id] !== undefined ? values[field.id] : ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-black/90 font-medium transition-all shadow-inner"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
