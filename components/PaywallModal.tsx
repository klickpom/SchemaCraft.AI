'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PRO_PLANS, setProUnlockedClient } from '@/lib/payment';
import { X, CheckCircle2, ShieldCheck, Zap, Lock, ArrowRight, Key } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string>('');

  if (!isOpen) return null;

  const plan = PRO_PLANS[0];

  const handleCheckout = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedKey = `SC-PRO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;
      setLicenseKey(generatedKey);
      setProUnlockedClient(true);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#0c0c12] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>{plan.badge}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {plan.name}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                {plan.description}
              </p>
            </div>

            {/* Plan Price Card */}
            <div className="relative rounded-xl border border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">{plan.period}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-2xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 space-y-2">
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 py-3 px-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Processing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Unlock Full Audit — {plan.price}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure Checkout
                </span>
                <span>•</span>
                <span>PayPal & Card</span>
                <span>•</span>
                <span>Instant Delivery</span>
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
                Your full audit is now unlocked with all detected issues, platform-specific code fixes, and AI search opportunities.
              </p>
            </div>

            {/* License Key Display */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
                <Key className="h-3 w-3" /> Your Pro License Key
              </span>
              <div className="font-mono text-base font-bold text-white select-all bg-black/60 py-2 px-3 rounded-lg border border-emerald-500/20">
                {licenseKey}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer active:scale-95"
            >
              View Full Audit Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
