'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/lib/translations';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface LiveActivityTickerProps {
  lang: Language;
}

const ACTIVITIES = [
  { domain: 'growthstack.io', type: 'SaaS App', score: 94, location: 'San Francisco, CA' },
  { domain: 'nordicoutfitters.com', type: 'Shopify Store', score: 91, location: 'Stockholm, Sweden' },
  { domain: 'apolloclinics.co.uk', type: 'Medical Clinic', score: 89, location: 'London, UK' },
  { domain: 'hypermetrics.dev', type: 'Next.js SaaS', score: 96, location: 'Austin, TX' },
  { domain: 'veloxagency.de', type: 'Agency White-Label', score: 98, location: 'Berlin, Germany' },
  { domain: 'artisanbakery.com.au', type: 'Local Business', score: 92, location: 'Sydney, Australia' },
  { domain: 'dubaisaas.ae', type: 'Enterprise Software', score: 95, location: 'Dubai, UAE' },
];

export default function LiveActivityTicker({ lang }: LiveActivityTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 500);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const act = ACTIVITIES[currentIndex];

  return (
    <div className={`fixed bottom-4 left-4 z-30 transition-all duration-500 transform ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0e0e18]/90 backdrop-blur-md border border-white/15 shadow-2xl shadow-black/80 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="font-mono text-cyan-300 font-bold">{act.domain}</span>
            <span className="text-[10px] text-slate-500">•</span>
            <span className="text-[10px] text-slate-400 font-mono">{act.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold font-mono">Score: {act.score}/100</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-300 font-semibold">{act.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
