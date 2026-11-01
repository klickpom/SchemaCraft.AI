import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(path.join(process.cwd(), '../../.github/workflows/ci.yml'), 'utf8');

describe('deploy pipeline', () => {
  it('publishes only the static marketing site', () => {
    const publish = workflow.slice(workflow.indexOf('Publish static site to the deploy branch'));
    expect(publish).toContain('cp -a apps/web/out/. "$DEST/"');
    expect(publish).toContain('apps/web/public/api/audit.php');
    expect(publish).toContain('apps/web/public/.htaccess');
    expect(publish).not.toContain('apps/app');
  });

  it('builds the signed-in app before the sitemap check', () => {
    const buildAt = workflow.indexOf('npm run build -w @schemacraft/app');
    const sitemapAt = workflow.indexOf('Check the published sitemap URL set');
    expect(buildAt).toBeGreaterThan(0);
    expect(buildAt).toBeLessThan(sitemapAt);
  });
});
