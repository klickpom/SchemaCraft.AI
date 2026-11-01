import { describe, expect, it } from 'vitest';
import { createEngines } from './engines';
import { PLAN_LIMITS, RUNS_PER_PROMPT } from './plans';
import { generateBuyerQuestions } from './prompts';
import { hostOfCitedUrl, shareOfVoice, topCounts } from './report';
import { MemoryRepository } from './repository';
import { runRadar } from './runner';

describe('dry-run radar flow', () => {
  it('lets a user edit prompts, stores raw answers, and renders a ranged report the other user cannot read', async () => {
    const repo = new MemoryRepository();
    const userA = 'user-a';
    const userB = 'user-b';
    const site = {
      id: 'site-a',
      userId: userA,
      domain: 'brightsmile.example',
      country: 'SA',
      city: 'Riyadh',
      language: 'en',
      niche: 'dental clinic',
      brand: 'Bright Smile',
      homepageText: 'Bright Smile fits clear aligners for families in Riyadh.',
    };
    await repo.saveSite(site);
    await repo.saveSite({ ...site, id: 'site-b', userId: userB, domain: 'other.example', brand: 'Other' });

    let prompts = generateBuyerQuestions(site).map((draft, index) => ({
      id: `prompt-${index}`,
      userId: userA,
      siteId: site.id,
      body: draft.body,
      locale: draft.locale,
      position: index,
    }));
    prompts = prompts.filter((prompt) => prompt.id !== 'prompt-1');
    prompts.push({ id: 'custom', userId: userA, siteId: site.id, body: 'Who offers aligners in Riyadh?', locale: 'en', position: 100 });
    prompts = prompts.map((prompt, index) => ({ ...prompt, position: index, body: prompt.id === 'prompt-0' ? 'Edited buyer question for Riyadh dental clinic' : prompt.body }));
    await repo.savePrompts(userA, site.id, prompts);

    const saved = await repo.listPrompts(userA, site.id);
    expect(saved.some((prompt) => prompt.body.startsWith('Edited'))).toBe(true);
    expect(saved.some((prompt) => prompt.id === 'custom')).toBe(true);
    expect(await repo.listPrompts(userB, site.id)).toEqual([]);
    expect(await repo.listSites(userB)).toHaveLength(1);

    const result = await runRadar({
      prompts: saved.map((prompt) => ({ id: prompt.id, body: prompt.body })),
      engines: createEngines({}),
      maxPrompts: PLAN_LIMITS.free.maxPrompts,
      runsPerPrompt: RUNS_PER_PROMPT,
      budgetUsd: PLAN_LIMITS.free.monthlyBudgetUsd,
      spentUsd: await repo.spentUsd(userA),
      brand: site.brand,
      domain: site.domain,
    });
    await repo.saveCalls(userA, result.calls.map((call) => ({
      id: `${call.promptId}-${call.engine}-${call.runIndex}`,
      userId: userA,
      siteId: site.id,
      promptId: call.promptId,
      engine: call.engine,
      runIndex: call.runIndex,
      rawAnswer: call.rawAnswer,
      source: call.source,
      brandMentioned: call.mention.brandMentioned,
      domainMentioned: call.mention.domainMentioned,
      position: call.mention.position,
      sentiment: call.mention.sentiment,
      competitors: call.mention.competitors,
      citedUrls: call.mention.citedUrls,
      inputTokens: call.inputTokens,
      outputTokens: call.outputTokens,
      costUsd: call.costUsd,
    })));

    const calls = await repo.listCalls(userA, site.id);
    expect(calls.every((call) => call.rawAnswer.length > 0 && call.source === 'dry-run')).toBe(true);
    expect(await repo.listCalls(userB, site.id)).toEqual([]);
    const report = shareOfVoice(calls.map((call) => ({
      engine: call.engine,
      runIndex: call.runIndex,
      mentioned: call.brandMentioned || call.domainMentioned,
      competitors: call.competitors,
      citedUrls: call.citedUrls,
    })));
    expect(report.length).toBe(2);
    for (const row of report) {
      expect(row.min).not.toBeNull();
      expect(row.max).not.toBeNull();
      expect(row.shareOfVoice).toBeGreaterThanOrEqual(row.min as number);
      expect(row.shareOfVoice).toBeLessThanOrEqual(row.max as number);
    }
    const competitors = topCounts(calls.flatMap((call) => call.competitors));
    const domains = topCounts(calls.flatMap((call) => call.citedUrls.map(hostOfCitedUrl)));
    expect(competitors.length).toBeGreaterThan(0);
    expect(domains.some((row) => row.name === 'pearl.example')).toBe(true);
  });
});
