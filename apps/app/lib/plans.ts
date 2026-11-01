export const ENGINES = ['openai', 'perplexity'] as const;
export type EngineId = (typeof ENGINES)[number];

export const RUNS_PER_PROMPT = 3;
export const DRY_RUN_CALL_COST_USD = 0.02;

export const PLAN_LIMITS = {
  free: { monthlyBudgetUsd: 0.36, maxPrompts: 3 },
  starter: { monthlyBudgetUsd: 5, maxPrompts: 30 },
  pro: { monthlyBudgetUsd: 20, maxPrompts: 100 },
  agency: { monthlyBudgetUsd: 80, maxPrompts: 100 },
} as const;

export type PlanId = keyof typeof PLAN_LIMITS;

export class BudgetExceeded extends Error {
  readonly code = 'budget_exceeded';
  constructor(spentUsd: number, budgetUsd: number) {
    super(`Monthly budget reached (${spentUsd.toFixed(2)} of ${budgetUsd.toFixed(2)} USD). No further engine calls were made.`);
    this.name = 'BudgetExceeded';
  }
}
