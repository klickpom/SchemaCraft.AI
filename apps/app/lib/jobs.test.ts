import { describe, expect, it } from 'vitest';
import { enqueueRadar } from './jobs';

describe('radar jobs', () => {
  it('runs inline when Inngest is not configured', async () => {
    const seen: string[] = [];
    const mode = await enqueueRadar({ userId: 'a', siteId: 's' }, async (job) => {
      seen.push(job.siteId);
    }, {});
    expect(mode).toBe('inline');
    expect(seen).toEqual(['s']);
  });
});
