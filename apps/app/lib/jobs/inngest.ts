import { Inngest } from 'inngest';
import { dryRunEnabled } from '../mode';

export const inngest = new Inngest({ id: 'schemacraft' });

export const radarRun = inngest.createFunction(
  { id: 'radar-run' },
  { event: 'radar/run.requested' },
  async ({ event }) => {
    if (dryRunEnabled()) {
      return { mode: 'dry-run' as const, siteId: event.data.siteId };
    }
    return { mode: 'live' as const, siteId: event.data.siteId };
  },
);
