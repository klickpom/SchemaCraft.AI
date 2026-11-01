import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { dryRunEnabled } from './mode';

describe('dry-run default', () => {
  it('stays on when no key and no flag are set', () => {
    expect(dryRunEnabled({})).toBe(true);
    expect(dryRunEnabled({ SCHEMACRAFT_DRY_RUN: '1' })).toBe(true);
    expect(dryRunEnabled({ SCHEMACRAFT_DRY_RUN: '0' })).toBe(false);
  });

  it('is a server app, not a static export', () => {
    const config = readFileSync(path.join(process.cwd(), 'next.config.mjs'), 'utf8');
    expect(config).not.toMatch(/output:\s*['"]export['"]/);
  });
});
