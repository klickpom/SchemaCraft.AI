import type { Metadata, Viewport } from 'next';
import { Cairo, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700', '800'], variable: '--font-cairo', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jbmono', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SchemaCraft Radar',
  description: 'See whether AI answers mention a brand. Dry-run until API keys are configured. This does not promise citations or rankings.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cairo.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#060608] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
