import { dryRunEnabled } from './mode';

export interface RadarJob {
  userId: string;
  siteId: string;
}

export async function enqueueRadar(job: RadarJob, run: (job: RadarJob) => Promise<void>, env: NodeJS.ProcessEnv = process.env): Promise<'inline' | 'inngest'> {
  if (dryRunEnabled(env) || !env.INNGEST_EVENT_KEY) {
    await run(job);
    return 'inline';
  }
  const { Inngest } = await import('inngest');
  const client = new Inngest({ id: 'schemacraft', eventKey: env.INNGEST_EVENT_KEY });
  await client.send({ name: 'radar/run.requested', data: job });
  return 'inngest';
}
