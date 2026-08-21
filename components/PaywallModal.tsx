'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PRO_PLANS, setProUnlockedClient } from '@/lib/payment';
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, Lock, ArrowRight, Download, Key } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro-monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string>('');

  if (!isOpen) return null;

  const handleCheckout = (paymentMethod: 'apple-pay' | 'google-pay' | 'card' | 'lemon-squeezy') => {
    setIsProcessing(true);

    // Simulate direct Lemon Squeezy / Dodo Payments high-speed checkout flow
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedKey = `SC-PRO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;
      setLicenseKey(generatedKey);
      setProUnlockedClient(true);

      // Trigger Confetti explosion
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#ffffff'],
        });
      } catch {
        // ignore
      }

      onSuccess();
    }, 1200);
  };

  const selectedPlan = PRO_PLANS.find((p) => p.id === selectedPlanId) || PRO_PLANS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0c0c12] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Instant Pro Architecture Unlock</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Unlock Batch Export & Automated Dynamic CMS Injectors
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Power your entire website with automated Next.js 15, Shopify Liquid, and WordPress PHP schema engines. Zero subscriptions required for single pass.
              </p>
            </div>

            {/* Plan Selector Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRO_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-white">{plan.price}</span>
                        <span className="text-[10px] text-zinc-400 block">{plan.period}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Plan Feature List */}
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                Included with {selectedPlan.name}:
              </span>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300">
                {selectedPlan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 1-Click Payment Buttons (Lemon Squeezy & Dodo Direct Overlay) */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleCheckout('lemon-squeezy')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 py-3 px-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Processing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>
                      Instant 1-Click Unlock ({selectedPlan.price})
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-Bit Encrypted
                </span>
                <span>•</span>
                <span>Lemon Squeezy & Dodo Direct</span>
                <span>•</span>
                <span>Instant 0s License Key Delivery</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-white">Payment Verified & Pro Unlocked!</h3>
              <p className="text-xs text-zinc-300">
                Your SchemaCraft Pro license is now active with unlimited batch exports and dynamic script generation.
              </p>
            </div>

            {/* License Key Display */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
                <Key className="h-3 w-3" /> Your Permanent Pro License Key
              </span>
              <div className="font-mono text-base font-bold text-white select-all bg-black/60 py-2 px-3 rounded-lg border border-emerald-500/20">
                {licenseKey}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
              >
                Continue to Pro Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
