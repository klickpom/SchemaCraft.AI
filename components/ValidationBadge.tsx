'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Zap, ShieldCheck, Check } from 'lucide-react';
import { ValidationResult } from '@/lib/validator';

interface ValidationBadgeProps {
  validation: ValidationResult;
  onAutoFix?: () => void;
}

export function ValidationBadge({ validation, onAutoFix }: ValidationBadgeProps) {
  const { score, status, issues, passedChecks, googleRichResultEligible, aeoOptimizationScore } = validation;

  const scoreColor =
    score >= 90
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : score >= 70
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-md p-4 space-y-3">
      {/* Top bar: Score + Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border font-bold text-base ${scoreColor}`}>
            {score}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Google Rich Results Health</h4>
              {googleRichResultEligible ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  <ShieldCheck className="h-3 w-3" /> Eligible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400 ring-1 ring-inset ring-rose-500/20">
                  <AlertCircle className="h-3 w-3" /> Needs Fixes
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              0ms AST Client Validation • Schema.org v26.0
            </p>
          </div>
        </div>

        {/* AEO Metric */}
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-1.5">
          <Zap className="h-4 w-4 text-cyan-400" />
          <div className="text-xs">
            <span className="text-zinc-400">AEO / Perplexity Score: </span>
            <span className="font-semibold text-cyan-300">{aeoOptimizationScore}/100</span>
          </div>
        </div>
      </div>

      {/* Issues or Passed summary */}
      {issues.length > 0 ? (
        <div className="space-y-2 pt-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs ${
                issue.severity === 'error'
                  ? 'border-rose-500/20 bg-rose-500/5 text-rose-300'
                  : issue.severity === 'warning'
                  ? 'border-amber-500/20 bg-amber-500/5 text-amber-300'
                  : 'border-blue-500/20 bg-blue-500/5 text-blue-300'
              }`}
            >
              {issue.severity === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              )}
              <div className="flex-1 space-y-0.5">
                <p className="font-medium text-zinc-200">{issue.message}</p>
                <p className="text-[11px] text-zinc-400">{issue.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>All required Schema.org & Google Search Console fields are perfectly structured.</span>
        </div>
      )}

      {/* Passed Checks pills */}
      {passedChecks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {passedChecks.map((check, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-800/70 border border-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-300"
            >
              <Check className="h-2.5 w-2.5 text-emerald-400" />
              {check}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
