/**
 * SSRF URL guard — shared rules the PHP fetch endpoint must also enforce.
 * Reject anything that is not a public http(s) origin.
 */

const BLOCKED_V4: Array<[string, number]> = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
  ['100.64.0.0', 10],
];

export type UrlGuardResult =
  | { ok: true; href: string; host: string }
  | { ok: false; reason: 'invalid' | 'scheme' | 'credentials' | 'localhost' | 'blocked_host' };

function looksLikeIpv4(host: string): boolean {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return ((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0;
}

export function isBlockedIpv4(ip: string): boolean {
  const addr = ipv4ToInt(ip);
  if (addr === null) return false;
  for (const [base, bits] of BLOCKED_V4) {
    const baseInt = ipv4ToInt(base);
    if (baseInt === null) continue;
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    if ((addr & mask) === (baseInt & mask)) return true;
  }
  return false;
}

export function isBlockedIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) return true;
  return false;
}

const BLOCKED_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.google.internal.',
]);

export function assertPublicHttpUrl(raw: string): UrlGuardResult {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, reason: 'invalid' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'scheme' };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: 'credentials' };
  }

  const host = parsed.hostname.replace(/\.$/, '').toLowerCase();
  if (!host) return { ok: false, reason: 'invalid' };
  if (BLOCKED_HOSTS.has(host) || host.endsWith('.localhost')) {
    return { ok: false, reason: 'localhost' };
  }
  if (looksLikeIpv4(host) && isBlockedIpv4(host)) {
    return { ok: false, reason: 'blocked_host' };
  }
  if (host.includes(':') && isBlockedIpv6(host)) {
    return { ok: false, reason: 'blocked_host' };
  }

  parsed.hash = '';
  return { ok: true, href: parsed.href, host };
}
