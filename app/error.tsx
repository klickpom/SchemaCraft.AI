'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error('App Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08080f] text-zinc-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-white/15 bg-black/80 backdrop-blur-xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Temporary Refresh Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            A new version of SchemaCraft AI was just deployed. Please refresh to load the latest high-speed engine.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Application</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2 border border-white/10"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
