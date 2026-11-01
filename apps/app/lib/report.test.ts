import { describe, expect, it } from 'vitest';
import { shareOfVoice, topCounts } from './report';

describe('share of voice', () => {
  it('reports the percentage and the min-max across the three runs', () => {
    const runs = [1, 2, 3].flatMap((runIndex) => [
      { engine: 'openai', runIndex, mentioned: runIndex !== 2, competitors: runIndex === 2 ? ['Pearl Clinic'] : [], citedUrls: [] },
      { engine: 'perplexity', runIndex, mentioned: runIndex === 1, competitors: [], citedUrls: ['https://pearl.example/'] },
    ]);
    const report = shareOfVoice(runs);
    const openai = report.find((row) => row.engine === 'openai');
    const perplexity = report.find((row) => row.engine === 'perplexity');
    expect(openai).toMatchObject({ shareOfVoice: 66.7, min: 0, max: 100, runs: 3, mentioned: 2 });
    expect(perplexity).toMatchObject({ shareOfVoice: 33.3, min: 0, max: 100, runs: 3, mentioned: 1 });
    expect(openai && openai.min <= (openai.shareOfVoice ?? 0) && (openai.shareOfVoice ?? 0) <= openai.max).toBe(true);
  });

  it('leaves an engine with no runs unassessed and ranks competitors', () => {
    expect(shareOfVoice([])).toEqual([]);
    expect(topCounts(['Pearl Clinic', 'pearl.example', 'Pearl Clinic'])).toEqual([
      { name: 'Pearl Clinic', count: 2 },
      { name: 'pearl.example', count: 1 },
    ]);
  });
});
