import { describe, expect, it, vi } from 'vitest';
import { dryRunEngine } from './engines';
import { PLAN_LIMITS, RUNS_PER_PROMPT } from './plans';
import { shareOfVoice } from './report';
import { runRadar } from './runner';

describe('radar runner', () => {
  it('stops before a call that would pass the monthly budget', async () => {
    const answer = vi.fn(async () => ({ text: 'no mention', inputTokens: 1, outputTokens: 1, costUsd: 0.02, source: 'dry-run' as const }));
    const engine = { id: 'openai' as const, quote: () => 0.02, answer };
    const result = await runRadar({
      prompts: [{ id: 'p1', body: 'question' }],
      engines: [engine],
      maxPrompts: 3,
      runsPerPrompt: 3,
      budgetUsd: 0.02,
      spentUsd: 0,
      brand: 'Bright Smile',
      domain: 'brightsmile.example',
    });
    expect(answer).toHaveBeenCalledTimes(1);
    expect(result.stopped).toBe('budget');
    expect(result.calls).toHaveLength(1);
  });

  it('runs three free prompts on two engines and keeps a real min-max range', async () => {
    const prompts = Array.from({ length: 30 }, (_, index) => ({ id: `p${index}`, body: index % 2 ? 'فين أحسن عيادة؟' : 'Who is best?' }));
    const result = await runRadar({
      prompts,
      engines: [dryRunEngine('openai'), dryRunEngine('perplexity')],
      maxPrompts: PLAN_LIMITS.free.maxPrompts,
      runsPerPrompt: RUNS_PER_PROMPT,
      budgetUsd: PLAN_LIMITS.free.monthlyBudgetUsd,
      spentUsd: 0,
      brand: 'Bright Smile',
      domain: 'brightsmile.example',
    });
    expect(result.stopped).toBe('done');
    expect(result.calls).toHaveLength(18);
    expect(new Set(result.calls.map((call) => call.promptId)).size).toBe(3);
    const report = shareOfVoice(result.calls.map((call) => ({
      engine: call.engine,
      runIndex: call.runIndex,
      mentioned: call.mention.brandMentioned || call.mention.domainMentioned,
      competitors: call.mention.competitors,
      citedUrls: call.mention.citedUrls,
    })));
    for (const row of report) {
      expect(row.shareOfVoice).not.toBeNull();
      expect(row.min).not.toBeNull();
      expect(row.max).not.toBeNull();
      expect(row.min).toBeLessThan(row.max as number);
    }
  });
});
