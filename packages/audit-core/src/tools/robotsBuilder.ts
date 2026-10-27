import { ACTIVE_BOTS, type BotRegistryEntry } from '../bots/registry';

export type RobotsPreset = 'search-not-training' | 'allow-all' | 'block-ai';

export interface RobotsOptions {
  blocked: string[];
  disallowPaths: string[];
  sitemapUrl: string | null;
}

export function presetBlocked(preset: RobotsPreset): string[] {
  if (preset === 'allow-all') return [];
  if (preset === 'block-ai') {
    return ACTIVE_BOTS.filter((b) => !['googlebot', 'bingbot', 'applebot'].includes(b.id)).map((b) => b.id);
  }
  return ACTIVE_BOTS.filter((b) => b.purpose === 'training').map((b) => b.id);
}

export function normalizePaths(raw: string): string[] {
  return [...new Set(
    raw.split(/[\n,]+/).map((p) => p.trim()).filter(Boolean).map((p) => (p.startsWith('/') || p.startsWith('*') ? p : `/${p}`)),
  )];
}

/** Bots without their own group inherit `User-agent: *`, so only blocked bots need a group (RFC 9309 §2.2.1). */
export function buildRobotsTxt(opts: RobotsOptions, bots: BotRegistryEntry[] = ACTIVE_BOTS): string {
  const lines: string[] = [];
  lines.push('User-agent: *');
  if (opts.disallowPaths.length === 0) lines.push('Allow: /');
  opts.disallowPaths.forEach((p) => lines.push(`Disallow: ${p}`));

  const blocked = bots.filter((b) => opts.blocked.includes(b.id));
  if (blocked.length > 0) {
    lines.push('');
    const purposes = [...new Set(blocked.map((b) => b.purpose))];
    lines.push(purposes.length === 1 && purposes[0] === 'training' ? '# AI training crawlers (does not affect AI search or Google Search)' : '# Blocked crawlers');
    blocked.forEach((b) => lines.push(`User-agent: ${b.userAgent}`));
    lines.push('Disallow: /');
  }

  if (opts.sitemapUrl) {
    lines.push('', `Sitemap: ${opts.sitemapUrl}`);
  }
  return `${lines.join('\n')}\n`;
}
