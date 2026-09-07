import { describe, expect, it } from 'vitest';
import { assertPublicHttpUrl, isBlockedIpv4 } from './urlGuard';

describe('assertPublicHttpUrl', () => {
  it('accepts a public https URL', () => {
    const result = assertPublicHttpUrl('https://madar.bond/');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.host).toBe('madar.bond');
  });

  it('rejects metadata and loopback targets', () => {
    expect(assertPublicHttpUrl('http://169.254.169.254/latest/meta-data').ok).toBe(false);
    expect(assertPublicHttpUrl('http://127.0.0.1:5432/').ok).toBe(false);
    expect(assertPublicHttpUrl('http://localhost/admin').ok).toBe(false);
    expect(assertPublicHttpUrl('file:///etc/passwd').ok).toBe(false);
  });

  it('rejects credentials in the URL', () => {
    expect(assertPublicHttpUrl('https://user:pass@example.com/').ok).toBe(false);
  });
});

describe('isBlockedIpv4', () => {
  it('blocks RFC1918 and link-local ranges', () => {
    expect(isBlockedIpv4('10.0.0.1')).toBe(true);
    expect(isBlockedIpv4('192.168.1.1')).toBe(true);
    expect(isBlockedIpv4('172.16.0.1')).toBe(true);
    expect(isBlockedIpv4('169.254.169.254')).toBe(true);
    expect(isBlockedIpv4('8.8.8.8')).toBe(false);
  });
});
