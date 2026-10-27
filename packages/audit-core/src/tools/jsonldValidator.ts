import type { JsonLdBlock } from '../audit/html';
import { analyzeSchema } from '../audit/schema';

export type LintLevel = 'error' | 'warning' | 'note';

export interface LintIssue {
  level: LintLevel;
  type: string;
  property: string;
  message: string;
}

export interface ValidatorResult {
  blocks: number;
  parseErrors: string[];
  types: string[];
  nodes: { types: string[]; topLevel: boolean }[];
  issues: LintIssue[];
  counts: Record<LintLevel, number>;
}

const SCRIPT_RE = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
const URL_PROPS = new Set(['url', 'logo', 'sameAs', 'contentUrl', 'thumbnailUrl', 'embedUrl', 'image', 'item', 'mainEntityOfPage']);
const DATE_PROPS = new Set(['datePublished', 'dateModified', 'dateCreated', 'startDate', 'endDate', 'uploadDate', 'datePosted', 'validThrough', 'priceValidUntil', 'validFrom', 'foundingDate', 'birthDate']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const PLACEHOLDER = /(example\.(com|org)|lorem ipsum|your[_ -]?(business|company|name|domain|url)|\bTODO\b|\bxxx+\b|\{\{|\[insert)/i;

/** Accepts raw JSON-LD, one or more `<script type="application/ld+json">` tags, or a full HTML document. */
export function extractJsonLdBlocks(input: string): JsonLdBlock[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const scripts = [...trimmed.matchAll(SCRIPT_RE)].map((m) => m[1].trim());
  const raws = scripts.length > 0 ? scripts : trimmed.startsWith('<') ? [] : [trimmed];
  return raws.map((raw) => {
    try {
      return { raw, data: JSON.parse(raw), error: null };
    } catch (err) {
      return { raw, data: null, error: (err as Error).message };
    }
  });
}

function lintValues(types: string[], data: Record<string, unknown>, issues: LintIssue[]): void {
  const type = types[0];
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('@')) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (typeof v !== 'string') continue;
      const s = v.trim();
      if (URL_PROPS.has(key) && s && !/^https?:\/\//i.test(s) && !s.startsWith('#')) {
        issues.push({ level: 'warning', type, property: key, message: `"${s.slice(0, 60)}" is not an absolute URL. Use the full https:// address.` });
      }
      if (DATE_PROPS.has(key) && s && !ISO_DATE.test(s)) {
        issues.push({ level: 'error', type, property: key, message: `"${s.slice(0, 40)}" is not an ISO 8601 date (e.g. 2026-10-19 or 2026-10-19T09:00:00+02:00).` });
      }
      if (PLACEHOLDER.test(s)) {
        issues.push({ level: 'warning', type, property: key, message: `"${s.slice(0, 60)}" looks like placeholder text. Replace it with your real data.` });
      }
    }
  }

  if (types.some((t) => t === 'Offer' || t === 'AggregateOffer')) {
    for (const prop of ['price', 'lowPrice', 'highPrice']) {
      const price = data[prop];
      if (typeof price === 'string' && price.trim() && !/^\d+(\.\d+)?$/.test(price.trim())) {
        issues.push({ level: 'error', type, property: prop, message: `"${price}" must be a plain number with a dot for decimals — no currency symbols or thousands separators.` });
      }
    }
    const currency = data.priceCurrency;
    if (typeof currency === 'string' && !/^[A-Z]{3}$/.test(currency.trim())) {
      issues.push({ level: 'error', type, property: 'priceCurrency', message: `"${currency}" must be a 3-letter ISO 4217 code such as USD, EUR or EGP.` });
    }
  }

  if (types.includes('AggregateRating') || types.includes('Rating')) {
    const value = Number(data.ratingValue);
    const best = data.bestRating !== undefined ? Number(data.bestRating) : 5;
    const worst = data.worstRating !== undefined ? Number(data.worstRating) : 1;
    if (data.ratingValue !== undefined && (Number.isNaN(value) || value > best || value < worst)) {
      issues.push({ level: 'error', type, property: 'ratingValue', message: `ratingValue ${String(data.ratingValue)} is outside the ${worst}–${best} scale.` });
    }
    if (types.includes('AggregateRating') && data.ratingCount === undefined && data.reviewCount === undefined) {
      issues.push({ level: 'error', type, property: 'ratingCount or reviewCount', message: 'AggregateRating needs ratingCount or reviewCount.' });
    }
  }
}

export function validateJsonLd(input: string): ValidatorResult {
  const blocks = extractJsonLdBlocks(input);
  const analysis = analyzeSchema(blocks);
  const issues: LintIssue[] = [];

  if (blocks.length > 0 && analysis.parseErrors.length < blocks.length && !analysis.hasContext) {
    issues.push({ level: 'error', type: '@context', property: '@context', message: 'Missing "@context": "https://schema.org". Without it the block is not read as Schema.org.' });
  }
  for (const p of analysis.problems) {
    issues.push({
      level: p.level === 'required' ? 'error' : 'warning',
      type: p.type,
      property: p.property,
      message: p.level === 'required'
        ? `Google requires this property on ${p.type}; without it the item is not eligible for rich results.`
        : `Google recommends this property on ${p.type}; it adds detail but is not required.`,
    });
  }
  for (const node of analysis.nodes) lintValues(node.types, node.data, issues);
  for (const t of analysis.deprecatedTypes) {
    issues.push({ level: 'note', type: t, property: '@type', message: `${t} rich results are no longer shown by Google. The markup is harmless but will not produce a rich result.` });
  }
  if (analysis.nodes.some((n) => n.types.includes('FAQPage'))) {
    issues.push({ level: 'note', type: 'FAQPage', property: '@type', message: 'Since 2023 Google shows FAQ rich results only for well-known government and health sites. FAQ markup still helps machines understand Q&A content.' });
  }

  const counts: Record<LintLevel, number> = { error: 0, warning: 0, note: 0 };
  issues.forEach((i) => { counts[i.level] += 1; });
  counts.error += analysis.parseErrors.length;

  return {
    blocks: blocks.length,
    parseErrors: analysis.parseErrors,
    types: analysis.types,
    nodes: analysis.nodes.map((n) => ({ types: n.types, topLevel: n.topLevel })),
    issues,
    counts,
  };
}
