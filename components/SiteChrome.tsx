'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PaywallModal } from '@/components/PaywallModal';
import { isProUnlockedClient } from '@/lib/payment';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    setIsPro(isProUnlockedClient());
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08080f] text-zinc-100 flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_70%)]" />
      </div>
      <Header onOpenPaywall={() => setShowPaywall(true)} isPro={isPro} />
      <div className="relative z-10 flex-1">{children}</div>
      <Footer />
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={() => {
          setIsPro(true);
          setShowPaywall(false);
        }}
      />
    </div>
  );
}
