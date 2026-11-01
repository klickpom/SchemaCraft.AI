import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('top fixes on the audit result', () => {
  const source = readFileSync(path.join(process.cwd(), 'components/audit/TopFixes.tsx'), 'utf8');

  it('shows three ranked cards, a later line, one re-check, and optional IndexNow', () => {
    expect(source).toContain('rankFixes');
    expect(source).toContain('Check again');
    expect(source).toContain('أعد الفحص');
    expect(source).toContain('Later');
    expect(source).toContain('لاحقاً');
    expect(source).toContain('ranked.indexNow.note');
    expect(source).toContain('Copy IndexNow body');
    expect(source).not.toContain('fetch(');
  });
});
