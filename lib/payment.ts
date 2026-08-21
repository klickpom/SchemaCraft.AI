export interface ProPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const PRO_PLANS: ProPlan[] = [
  {
    id: 'fix-my-website',
    name: 'Fix My Website — Full Audit',
    price: '$9',
    period: 'one-time',
    badge: 'Lifetime Access',
    description: 'Unlock all detected issues, platform-specific code fixes, and AI search opportunities for your website.',
    features: [
      'All detected issues & blockers revealed',
      'Platform-specific code fixes (WordPress, Next.js, Shopify)',
      'AI Search Opportunity Finder matrix',
      'Context-aware Schema.org JSON-LD generator',
      '30-Day Money-Back Guarantee',
    ],
    recommended: true,
  },
];

const LOCAL_STORAGE_PRO_KEY = 'schemacraft_pro_unlocked_v1';

export function isProUnlockedClient(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_PRO_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function setProUnlockedClient(status: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PRO_KEY, status ? 'true' : 'false');
  } catch {
    // ignore
  }
}
