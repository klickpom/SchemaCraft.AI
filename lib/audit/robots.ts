/**
 * robots.txt parser and matcher following RFC 9309 and Google's documented behaviour:
 * - groups start at one or more consecutive `user-agent` lines; groups for the same agent merge
 * - the most specific matching group applies; `*` is the fallback
 * - the longest matching rule wins; on equal length `allow` wins
 * - `*` wildcards and a trailing `$` anchor are supported
 */

export interface RobotsRule {
  type: 'allow' | 'disallow';
  path: string;
  line: number;
}

export interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
}

export interface ParsedRobots {
  groups: RobotsGroup[];
  sitemaps: string[];
  invalidLines: { line: number; text: string }[];
  byteLength: number;
}

export interface RobotsVerdict {
  allowed: boolean;
  /** `token` = a group names this crawler, `*` = wildcard group, `none` = no applicable group. */
  matchedBy: 'token' | '*' | 'none';
  rule: RobotsRule | null;
}

const KNOWN_KEYS = new Set([
  'user-agent', 'allow', 'disallow', 'sitemap', 'crawl-delay', 'host', 'clean-param', 'noindex', 'request-rate', 'visit-time',
]);

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  const invalidLines: ParsedRobots['invalidLines'] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;

  const lines = (text || '').replace(/^\uFEFF/, '').split(/\r\n|\r|\n/);
  lines.forEach((rawLine, index) => {
    const lineNo = index + 1;
    const withoutComment = rawLine.replace(/#.*$/, '').trim();
    if (!withoutComment) return;
    const colon = withoutComment.indexOf(':');
    if (colon <= 0) {
      invalidLines.push({ line: lineNo, text: rawLine.trim().slice(0, 120) });
      return;
    }
    const key = withoutComment.slice(0, colon).trim().toLowerCase();
    const value = withoutComment.slice(colon + 1).trim();

    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      return;
    }
    lastWasAgent = false;

    if (key === 'allow' || key === 'disallow') {
      if (!current) {
        invalidLines.push({ line: lineNo, text: rawLine.trim().slice(0, 120) });
        return;
      }
      if (value === '') return;
      current.rules.push({ type: key, path: value, line: lineNo });
      return;
    }
    if (key === 'sitemap') {
      if (value) sitemaps.push(value);
      return;
    }
    if (!KNOWN_KEYS.has(key)) {
      invalidLines.push({ line: lineNo, text: rawLine.trim().slice(0, 120) });
    }
  });

  return {
    groups,
    sitemaps,
    invalidLines,
    byteLength: new TextEncoder().encode(text || '').length,
  };
}

function agentToken(agent: string): string {
  return agent.split(/[\s/]/)[0].trim().toLowerCase();
}

function patternMatches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  const regex = new RegExp(`^${escaped}${anchored ? '$' : ''}`);
  return regex.test(path);
}

function normalizePath(path: string): string {
  let p = path || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  try {
    p = p.replace(/%[0-9a-f]{2}/gi, (m) => m.toUpperCase());
  } catch {
    // keep raw
  }
  return p;
}

/** Rules that apply to a crawler product token (e.g. `GPTBot`). */
export function rulesFor(robots: ParsedRobots, userAgent: string): { rules: RobotsRule[]; matchedBy: RobotsVerdict['matchedBy'] } {
  const token = userAgent.toLowerCase();
  const specific = robots.groups.filter((group) => group.agents.some((agent) => agentToken(agent) === token));
  if (specific.length > 0) {
    return { rules: specific.flatMap((group) => group.rules), matchedBy: 'token' };
  }
  const wildcard = robots.groups.filter((group) => group.agents.some((agent) => agent === '*'));
  if (wildcard.length > 0) {
    return { rules: wildcard.flatMap((group) => group.rules), matchedBy: '*' };
  }
  return { rules: [], matchedBy: 'none' };
}

export function evaluateRobots(robots: ParsedRobots, userAgent: string, pathWithQuery: string): RobotsVerdict {
  const path = normalizePath(pathWithQuery);
  if (path === '/robots.txt') return { allowed: true, matchedBy: 'none', rule: null };
  const { rules, matchedBy } = rulesFor(robots, userAgent);
  let best: RobotsRule | null = null;
  for (const rule of rules) {
    if (!patternMatches(normalizePath(rule.path), path)) continue;
    if (
      !best ||
      rule.path.length > best.path.length ||
      (rule.path.length === best.path.length && rule.type === 'allow' && best.type === 'disallow')
    ) {
      best = rule;
    }
  }
  return { allowed: !best || best.type === 'allow', matchedBy, rule: best };
}

export function describeRule(rule: RobotsRule | null): string {
  if (!rule) return 'no matching rule';
  return `${rule.type === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path} (line ${rule.line})`;
}
