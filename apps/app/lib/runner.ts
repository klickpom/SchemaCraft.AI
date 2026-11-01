import type { AnswerEngine } from './engines';
import { parseMention, type MentionParse } from './parser';

export interface RadarPrompt {
  id: string;
  body: string;
}

export interface RadarCall {
  promptId: string;
  engine: string;
  runIndex: number;
  rawAnswer: string;
  source: 'dry-run' | 'live';
  mention: MentionParse;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export async function runRadar(input: {
  prompts: RadarPrompt[];
  engines: AnswerEngine[];
  maxPrompts: number;
  runsPerPrompt: number;
  budgetUsd: number;
  spentUsd: number;
  brand: string;
  domain: string;
}): Promise<{ calls: RadarCall[]; stopped: 'budget' | 'done'; spentUsd: number }> {
  const selected = input.prompts.slice(0, Math.max(0, input.maxPrompts));
  const calls: RadarCall[] = [];
  let spent = input.spentUsd;
  for (const prompt of selected) {
    for (const engine of input.engines) {
      for (let runIndex = 1; runIndex <= input.runsPerPrompt; runIndex += 1) {
        const quote = engine.quote();
        if (spent + quote > input.budgetUsd + 1e-9) {
          return { calls, stopped: 'budget', spentUsd: spent };
        }
        const answer = await engine.answer(prompt.body, runIndex, input.brand, input.domain);
        spent = Math.round((spent + answer.costUsd) * 1_000_000) / 1_000_000;
        calls.push({
          promptId: prompt.id,
          engine: engine.id,
          runIndex,
          rawAnswer: answer.text,
          source: answer.source,
          mention: parseMention(answer.text, input.brand, input.domain),
          inputTokens: answer.inputTokens,
          outputTokens: answer.outputTokens,
          costUsd: answer.costUsd,
        });
      }
    }
  }
  return { calls, stopped: 'done', spentUsd: spent };
}
