import { DRY_RUN_CALL_COST_USD, type EngineId } from './plans';
import { dryRunEnabled } from './mode';

export interface EngineAnswer {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  source: 'dry-run' | 'live';
}

export interface AnswerEngine {
  id: EngineId;
  quote(): number;
  answer(prompt: string, runIndex: number, brand: string, domain: string): Promise<EngineAnswer>;
}

const OPENAI_RATES = { inputPerMillion: 2, outputPerMillion: 8 };
const PERPLEXITY_RATES = { inputPerMillion: 1, outputPerMillion: 1 };
export const LIVE_CALL_CEILING_USD = 0.05;

export function estimateCost(engine: EngineId, inputTokens: number, outputTokens: number): number {
  const rates = engine === 'openai' ? OPENAI_RATES : PERPLEXITY_RATES;
  const cost = (inputTokens * rates.inputPerMillion + outputTokens * rates.outputPerMillion) / 1_000_000;
  return Math.round(cost * 1_000_000) / 1_000_000;
}

function dryText(engine: EngineId, runIndex: number, brand: string, domain: string, arabic: boolean): string {
  const host = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (arabic) {
    if (runIndex === 2) return `الناس تذكر عيادة اللؤلؤ في هذا السياق. https://pearl.example/ar`;
    if (runIndex === 3) return `وفي ملاحظة لاحقة تظهر ${brand}. https://${host}/`;
    return `${brand} هي الأفضل حسب هذه الإجابة التجريبية. https://${host}/ وقارن مع عيادة اللؤلؤ https://pearl.example/ar`;
  }
  if (runIndex === 2) return `People mention Pearl Clinic instead. https://pearl.example/`;
  if (runIndex === 3) return `A later note says ${brand} is fine. https://${host}/pricing`;
  return `${brand} is the best option in this recorded answer. https://${host}/ See also Pearl Clinic https://pearl.example/`;
}

export function dryRunEngine(id: EngineId): AnswerEngine {
  return {
    id,
    quote: () => DRY_RUN_CALL_COST_USD,
    answer: async (prompt, runIndex, brand, domain) => ({
      text: dryText(id, runIndex, brand, domain, /[\u0600-\u06FF]/.test(prompt)),
      inputTokens: 400,
      outputTokens: 120,
      costUsd: DRY_RUN_CALL_COST_USD,
      source: 'dry-run',
    }),
  };
}

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export async function openAiWebSearch(prompt: string, apiKey: string, model: string, fetchImpl: typeof fetch): Promise<EngineAnswer> {
  const response = await fetchImpl('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, tools: [{ type: 'web_search' }], input: prompt }),
  });
  return readLive('openai', response);
}

export async function perplexitySonar(prompt: string, apiKey: string, model: string, fetchImpl: typeof fetch): Promise<EngineAnswer> {
  const response = await fetchImpl('https://api.perplexity.ai/v1/agent', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: prompt, tools: [{ type: 'web_search' }] }),
  });
  return readLive('perplexity', response);
}

async function readLive(engine: EngineId, response: FetchResponse): Promise<EngineAnswer> {
  if (!response.ok) {
    throw new Error(`${engine} returned HTTP ${response.status}`);
  }
  const body = await response.json() as {
    output_text?: string;
    output?: { type?: string; content?: { type?: string; text?: string }[] }[];
    usage?: { input_tokens?: number; output_tokens?: number; prompt_tokens?: number; completion_tokens?: number };
  };
  const text = body.output_text
    || body.output?.flatMap((item) => item.content ?? []).map((part) => part.text ?? '').join('\n')
    || '';
  if (!text.trim()) throw new Error(`${engine} returned no answer text`);
  const inputTokens = body.usage?.input_tokens ?? body.usage?.prompt_tokens;
  const outputTokens = body.usage?.output_tokens ?? body.usage?.completion_tokens;
  if (inputTokens == null || outputTokens == null) {
    return { text, inputTokens: 0, outputTokens: 0, costUsd: LIVE_CALL_CEILING_USD, source: 'live' };
  }
  return { text, inputTokens, outputTokens, costUsd: estimateCost(engine, inputTokens, outputTokens), source: 'live' };
}

export function createEngines(env: NodeJS.ProcessEnv = process.env, fetchImpl: typeof fetch = fetch): AnswerEngine[] {
  if (dryRunEnabled(env)) return [dryRunEngine('openai'), dryRunEngine('perplexity')];
  return [
    {
      id: 'openai',
      quote: () => LIVE_CALL_CEILING_USD,
      answer: (prompt) => {
        if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');
        return openAiWebSearch(prompt, env.OPENAI_API_KEY, env.OPENAI_RADAR_MODEL || 'gpt-4.1', fetchImpl);
      },
    },
    {
      id: 'perplexity',
      quote: () => LIVE_CALL_CEILING_USD,
      answer: (prompt) => {
        if (!env.PERPLEXITY_API_KEY) throw new Error('PERPLEXITY_API_KEY is not configured');
        return perplexitySonar(prompt, env.PERPLEXITY_API_KEY, env.PERPLEXITY_RADAR_MODEL || 'perplexity/sonar', fetchImpl);
      },
    },
  ];
}
