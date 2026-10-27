import type { ServerPayload } from './types';

/** Browser-side call to the same-origin PHP evidence collector. */
export async function fetchAuditPayload(targetUrl: string): Promise<ServerPayload | null> {
  if (typeof window === 'undefined') return null;
  for (const endpoint of ['/api/audit.php', '/api/audit']) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('json')) continue;
      const data = (await res.json()) as ServerPayload;
      if (data && (data.ok === true || typeof data.error === 'string')) return data;
    } catch {
      // try the next path
    }
  }
  return null;
}

export function normalizeAuditUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!url.hostname.includes('.')) return null;
    return url.href;
  } catch {
    return null;
  }
}
