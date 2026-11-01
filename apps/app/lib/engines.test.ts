import { describe, expect, it, vi } from 'vitest';
import { createEngines, openAiWebSearch, perplexitySonar } from './engines';

describe('answer engines', () => {
  it('uses recorded fixtures unless dry-run is explicitly off', async () => {
    const [engine] = createEngines({});
    const answer = await engine.answer('Who is best?', 1, 'Bright Smile', 'brightsmile.example');
    expect(answer.source).toBe('dry-run');
    expect(answer.text).toContain('Bright Smile');
    expect(createEngines({ SCHEMACRAFT_DRY_RUN: '0', OPENAI_API_KEY: 'test', PERPLEXITY_API_KEY: 'test' }).map((item) => item.id)).toEqual(['openai', 'perplexity']);
  });

  it('asks OpenAI and Perplexity through their official web-search APIs', async () => {
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.tools).toEqual([{ type: 'web_search' }]);
      expect(String(init?.headers && (init.headers as Record<string, string>).Authorization)).toContain('Bearer secret');
      return {
        ok: true,
        status: 200,
        json: async () => ({
          output_text: `Answer from ${url}`,
          usage: { input_tokens: 1000, output_tokens: 500 },
        }),
      };
    });
    const openai = await openAiWebSearch('question', 'secret', 'gpt-4.1', fetchImpl as unknown as typeof fetch);
    const perplexity = await perplexitySonar('question', 'secret', 'perplexity/sonar', fetchImpl as unknown as typeof fetch);
    expect(fetchImpl.mock.calls[0][0]).toBe('https://api.openai.com/v1/responses');
    expect(fetchImpl.mock.calls[1][0]).toBe('https://api.perplexity.ai/v1/agent');
    expect(openai.text).toContain('api.openai.com');
    expect(openai.costUsd).toBeGreaterThan(0);
    expect(perplexity.costUsd).toBeGreaterThan(0);
    expect(JSON.parse(String(fetchImpl.mock.calls[1][1]?.body)).model).toBe('perplexity/sonar');
  });
});
