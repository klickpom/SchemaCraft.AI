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
    id: 'single-pass',
    name: 'Instant Single Pass',
    price: '$4.99',
    period: 'one-time',
    badge: 'Immediate Value',
    description: 'Instant full export & dynamic CMS injection bundle for your current project.',
    features: [
      'Instant Production-Ready HTML & Script Bundle',
      'Next.js 15 & Shopify Liquid Variable Injections',
      '100% Google Rich Results AST Compliance Report',
      'Direct Knowledge Graph Entity Disambiguation',
      'No recurring charges or subscription',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Lifetime Access',
    price: '$14.00',
    period: '/month',
    badge: 'Most Popular',
    recommended: true,
    description: 'Full unlimited batch exports, dynamic site crawl generators, and priority AEO tools.',
    features: [
      'Unlimited Batch Schema Site Generator (Up to 5,000 URLs)',
      'Automated Dynamic Variable CMS Script Engine',
      'Production HTML Bundle & REST API Webhooks',
      'Perplexity & ChatGPT AI Overview Ranking Simulator Pro',
      'Continuous Schema.org 2026 Core Algorithm Updates',
      'Priority 24/7 Developer Support',
    ],
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
