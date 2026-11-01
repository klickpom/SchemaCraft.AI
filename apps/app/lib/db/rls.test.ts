import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { describe, expect, it } from 'vitest';

const USER_A = '11111111-1111-4111-8111-111111111111';
const USER_B = '22222222-2222-4222-8222-222222222222';
const SITE_A = '33333333-3333-4333-8333-333333333333';
const SITE_B = '44444444-4444-4444-8444-444444444444';
const PROMPT_A = '55555555-5555-4555-8555-555555555555';
const PROMPT_B = '66666666-6666-4666-8666-666666666666';
const RUN_A = '77777777-7777-4777-8777-777777777777';
const RUN_B = '88888888-8888-4888-8888-888888888888';

const TABLES = ['users', 'sites', 'prompts', 'runs', 'mentions', 'fixes', 'subscriptions', 'usage_costs'] as const;

async function asUser<T>(db: PGlite, userId: string, query: string): Promise<T[]> {
  await db.exec('reset role');
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId]);
  await db.exec('set role authenticated');
  const result = await db.query<T>(query);
  await db.exec('reset role');
  return result.rows;
}

describe('row level security', () => {
  it('lets user A read only their rows on every table', async () => {
    const db = new PGlite();
    await db.exec(readFileSync(path.join(process.cwd(), 'lib/db/schema.sql'), 'utf8'));
    await db.exec(`
      insert into public.users (id, email) values ('${USER_A}', 'a@example.com'), ('${USER_B}', 'b@example.com');
      insert into public.subscriptions (user_id, plan, monthly_budget_usd) values ('${USER_A}', 'free', 0.36), ('${USER_B}', 'free', 0.36);
      insert into public.sites (id, user_id, domain, country, city, language, niche, brand) values
        ('${SITE_A}', '${USER_A}', 'a.example', 'SA', 'Riyadh', 'en', 'dental', 'A'),
        ('${SITE_B}', '${USER_B}', 'b.example', 'EG', 'Cairo', 'ar', 'dental', 'B');
      insert into public.prompts (id, user_id, site_id, body, locale, position) values
        ('${PROMPT_A}', '${USER_A}', '${SITE_A}', 'question a', 'en', 0),
        ('${PROMPT_B}', '${USER_B}', '${SITE_B}', 'question b', 'ar', 0);
      insert into public.runs (id, user_id, site_id, prompt_id, engine, run_index, raw_answer, source) values
        ('${RUN_A}', '${USER_A}', '${SITE_A}', '${PROMPT_A}', 'openai', 1, 'answer a', 'dry-run'),
        ('${RUN_B}', '${USER_B}', '${SITE_B}', '${PROMPT_B}', 'openai', 1, 'answer b', 'dry-run');
      insert into public.mentions (user_id, site_id, run_id, brand_mentioned, domain_mentioned, sentiment) values
        ('${USER_A}', '${SITE_A}', '${RUN_A}', true, true, 'positive'),
        ('${USER_B}', '${SITE_B}', '${RUN_B}', false, false, 'not_assessed');
      insert into public.fixes (user_id, site_id, kind) values ('${USER_A}', '${SITE_A}', 'meta'), ('${USER_B}', '${SITE_B}', 'meta');
      insert into public.usage_costs (user_id, run_id, engine, input_tokens, output_tokens, cost_usd) values
        ('${USER_A}', '${RUN_A}', 'openai', 10, 10, 0.02),
        ('${USER_B}', '${RUN_B}', 'openai', 10, 10, 0.02);
    `);

    for (const table of TABLES) {
      const own = await asUser<{ id: string }>(db, USER_A, `select * from public.${table}`);
      const otherEmails = await asUser<{ email?: string; user_id?: string; id?: string }>(db, USER_A, `select * from public.${table}`);
      expect(own.length, table).toBe(1);
      const leaked = otherEmails.some((row) => row.user_id === USER_B || row.id === USER_B || row.email === 'b@example.com');
      expect(leaked, table).toBe(false);
    }

    const inserted = await db.exec('set role authenticated');
    expect(inserted).toBeTruthy();
    await db.exec('reset role');
    await expect(asUser(db, USER_A, `insert into public.sites (user_id, domain, country, city, language, niche, brand) values ('${USER_B}', 'stolen.example', 'SA', 'Riyadh', 'en', 'dental', 'B') returning id`)).rejects.toThrow();
  });
});
