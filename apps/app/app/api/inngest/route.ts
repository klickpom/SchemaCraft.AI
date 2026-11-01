import { serve } from 'inngest/next';
import { inngest, radarRun } from '@/lib/jobs/inngest';

export const { GET, POST, PUT } = serve({ client: inngest, functions: [radarRun] });
