/**
 * Single source of truth for audit scoring.
 * Every on-screen number (category scores, checks passed, issues found,
 * critical blockers) must be derived from AuditCheck[] — never from a
 * parallel ad-hoc formula.
 */

export type IssueCategory = 'technical' | 'crawlability' | 'content' | 'entity' | 'ai_readiness';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type CheckOutcome = 'pass' | 'fail' | 'warning' | 'info';
export type FixCategory = 'robots' | 'schema' | 'meta' | 'content' | 'sitemap' | 'headers';

export const PENALTY_PER_WEIGHT = 7.5;

export interface LedgerItem {
  name: string;
  nameAr: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  detail: string;
  detailAr: string;
}

export interface FindingLike {
  id: string;
  category: IssueCategory;
  severity: Severity;
  weight: number;
  penalty?: number;
  title: string;
  titleAr: string;
  signalDetected: string;
  signalDetectedAr: string;
  evidence: string;
  evidenceAr: string;
  whyItMatters: string;
  whyItMattersAr: string;
  recommendedAction: string;
  recommendedActionAr: string;
  fixCategory: FixCategory;
  isFreePreview?: boolean;
}

export interface AuditCheck extends FindingLike {
  outcome: CheckOutcome;
  penalty: number;
  ledgerName: string;
  ledgerNameAr: string;
  ledgerDetail: string;
  ledgerDetailAr: string;
}

export interface CategoryScores {
  technicalSEO: number;
  crawlability: number;
  contentAnswerability: number;
  entitySchema: number;
  aiSearchReadiness: number;
}

export const CATEGORY_TO_SCORE: Record<IssueCategory, keyof CategoryScores> = {
  technical: 'technicalSEO',
  crawlability: 'crawlability',
  content: 'contentAnswerability',
  entity: 'entitySchema',
  ai_readiness: 'aiSearchReadiness',
};

export const SCORE_TO_CATEGORIES: Record<keyof CategoryScores, IssueCategory[]> = {
  technicalSEO: ['technical'],
  crawlability: ['crawlability'],
  contentAnswerability: ['content'],
  entitySchema: ['entity'],
  aiSearchReadiness: ['ai_readiness', 'crawlability', 'content', 'entity'],
};

export function penaltyOf(finding: Pick<FindingLike, 'weight' | 'penalty'>): number {
  return finding.penalty ?? finding.weight * PENALTY_PER_WEIGHT;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function categoryScore(checks: AuditCheck[], category: IssueCategory): number {
  const penalty = checks
    .filter((c) => c.category === category && c.outcome === 'fail')
    .reduce((sum, c) => sum + c.penalty, 0);
  return clampScore(100 - penalty);
}

export function scoresFromChecks(checks: AuditCheck[]): CategoryScores {
  const technicalSEO = categoryScore(checks, 'technical');
  const crawlability = categoryScore(checks, 'crawlability');
  const contentAnswerability = categoryScore(checks, 'content');
  const entitySchema = categoryScore(checks, 'entity');
  const aiOwn = categoryScore(checks, 'ai_readiness');
  const blended = crawlability * 0.35 + contentAnswerability * 0.35 + entitySchema * 0.3;
  const aiSearchReadiness = clampScore(Math.min(aiOwn, blended));
  return { technicalSEO, crawlability, contentAnswerability, entitySchema, aiSearchReadiness };
}

export function overallScoreFromCategories(scores: CategoryScores): number {
  return clampScore(
    scores.technicalSEO * 0.2 +
      scores.crawlability * 0.25 +
      scores.contentAnswerability * 0.25 +
      scores.entitySchema * 0.2 +
      scores.aiSearchReadiness * 0.1
  );
}

export function countPassed(checks: AuditCheck[]): number {
  return checks.filter((c) => c.outcome === 'pass').length;
}

export function countFindings(checks: AuditCheck[]): number {
  return checks.filter((c) => c.outcome === 'fail').length;
}

export function countCritical(checks: AuditCheck[]): number {
  return checks.filter((c) => c.outcome === 'fail' && c.severity === 'critical').length;
}

export function findingsFromChecks(checks: AuditCheck[]): AuditCheck[] {
  return checks.filter((c) => c.outcome === 'fail' || c.outcome === 'info');
}

export function ledgerFromChecks(checks: AuditCheck[]): LedgerItem[] {
  return checks.map((c) => ({
    name: c.ledgerName,
    nameAr: c.ledgerNameAr,
    status: c.outcome === 'fail' ? 'fail' : c.outcome,
    detail: c.ledgerDetail,
    detailAr: c.ledgerDetailAr,
  }));
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

export function findingToCheck(finding: FindingLike): AuditCheck {
  const outcome: CheckOutcome = finding.severity === 'informational' ? 'info' : 'fail';
  return {
    ...finding,
    outcome,
    penalty: outcome === 'fail' ? penaltyOf(finding) : 0,
    ledgerName: finding.title,
    ledgerNameAr: finding.titleAr,
    ledgerDetail: finding.evidence || finding.signalDetected,
    ledgerDetailAr: finding.evidenceAr || finding.signalDetectedAr,
  };
}

export function ledgerToCheck(item: LedgerItem): AuditCheck {
  return {
    id: `ledger-${slug(item.name)}`,
    category: 'technical',
    severity: 'informational',
    weight: 0,
    penalty: 0,
    outcome: item.status,
    title: item.name,
    titleAr: item.nameAr,
    signalDetected: item.detail,
    signalDetectedAr: item.detailAr,
    evidence: item.detail,
    evidenceAr: item.detailAr,
    whyItMatters: '',
    whyItMattersAr: '',
    recommendedAction: '',
    recommendedActionAr: '',
    fixCategory: 'headers',
    ledgerName: item.name,
    ledgerNameAr: item.nameAr,
    ledgerDetail: item.detail,
    ledgerDetailAr: item.detailAr,
  };
}

/**
 * Merge evaluator outputs into one check list. Ledger `fail` rows are skipped
 * because they duplicate findings already present as issues.
 */
export function assembleChecks(issues: FindingLike[], ledger: LedgerItem[]): AuditCheck[] {
  const fromIssues = issues.map(findingToCheck);
  const fromLedger = ledger
    .filter((item) => item.status !== 'fail')
    .map(ledgerToCheck);
  return [...fromIssues, ...fromLedger];
}

export class AuditConsistencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuditConsistencyError';
  }
}

export function assertAuditConsistency(checks: AuditCheck[], scores: CategoryScores): void {
  const computed = scoresFromChecks(checks);
  for (const key of Object.keys(computed) as (keyof CategoryScores)[]) {
    if (computed[key] !== scores[key]) {
      throw new AuditConsistencyError(
        `Score mismatch for ${key}: report=${scores[key]} computed=${computed[key]}`
      );
    }
  }

  for (const [scoreKey, categories] of Object.entries(SCORE_TO_CATEGORIES) as [keyof CategoryScores, IssueCategory[]][]) {
    if (scores[scoreKey] >= 100) continue;
    const hasFinding = checks.some(
      (c) => c.outcome === 'fail' && categories.includes(c.category)
    );
    if (!hasFinding) {
      throw new AuditConsistencyError(
        `${scoreKey} is ${scores[scoreKey]} but no failing check explains the deduction`
      );
    }
  }
}

export function auditBadgeLabels(
  count: number,
  lang: 'en' | 'ar',
  kind: 'critical' | 'issues' | 'passed'
): string {
  if (lang === 'ar') {
    if (kind === 'critical') return `${count} ${count === 1 ? 'عائق حرج' : 'عوائق حرجة'}`;
    if (kind === 'issues') return `${count} ${count === 1 ? 'مشكلة مكتشفة' : 'مشاكل مكتشفة'}`;
    return `${count} ${count === 1 ? 'فحص ناجح' : 'فحوصات ناجحة'}`;
  }
  if (kind === 'critical') return `${count} ${count === 1 ? 'Critical Blocker' : 'Critical Blockers'}`;
  if (kind === 'issues') return `${count} ${count === 1 ? 'Issue Found' : 'Issues Found'}`;
  return `${count} ${count === 1 ? 'Check Passed' : 'Checks Passed'}`;
}

export const HTML_NOT_FETCHED_CONTENT: FindingLike = {
  id: 'content-html-not-fetched',
  category: 'content',
  severity: 'high',
  weight: 0,
  penalty: 50,
  title: 'Content checks could not run — HTML was not fetched',
  titleAr: 'فحوصات المحتوى لم تُنفَّذ — تعذر جلب HTML',
  signalDetected: 'Live HTML was not retrieved, so title/lead/heading answerability could not be inspected.',
  signalDetectedAr: 'لم يُجلب HTML الحي، لذلك تعذر فحص العنوان والمقدمة والعناوين.',
  evidence: 'htmlFetched = false',
  evidenceAr: 'htmlFetched = false',
  whyItMatters: 'Without the page HTML we cannot verify BLUF, headings, or extractable answers. The content score is reduced because those checks did not pass — not because they were skipped silently.',
  whyItMattersAr: 'بدون HTML لا يمكن التحقق من المقدمة أو العناوين. نُقصِد درجة المحتوى لأن الفحوصات لم تنجح، وليس لأنها اختفت.',
  recommendedAction: 'Allow the auditor (or search crawlers) to retrieve the HTML, then re-run. A browser cannot bypass third-party CORS or WAF challenges from the client.',
  recommendedActionAr: 'اسمح للمُدقّق (أو زواحف البحث) بجلب HTML ثم أعد الفحص. المتصفح لا يتجاوز CORS أو تحدي WAF من جهة العميل.',
  fixCategory: 'headers',
  isFreePreview: true,
};

export const HTML_NOT_FETCHED_ENTITY: FindingLike = {
  id: 'entity-html-not-fetched',
  category: 'entity',
  severity: 'high',
  weight: 0,
  penalty: 50,
  title: 'Structured data checks could not run — HTML was not fetched',
  titleAr: 'فحوصات البيانات المنظمة لم تُنفَّذ — تعذر جلب HTML',
  signalDetected: 'Live HTML was not retrieved, so JSON-LD / Schema.org blocks could not be parsed.',
  signalDetectedAr: 'لم يُجلب HTML الحي، لذلك تعذر تحليل JSON-LD.',
  evidence: 'htmlFetched = false',
  evidenceAr: 'htmlFetched = false',
  whyItMatters: 'Entity and schema scoring requires the actual markup on the page. A 50-point reduction here means those checks did not complete, not a hidden default.',
  whyItMattersAr: 'تقييم الكيانات يحتاج الوسم الفعلي في الصفحة. خصم 50 نقطة يعني أن الفحص لم يكتمل، وليس رقماً افتراضياً مخفياً.',
  recommendedAction: 'Unblock HTML retrieval for crawlers, then re-run so JSON-LD can be extracted as evidence.',
  recommendedActionAr: 'أزل حظر جلب HTML للزواحف ثم أعد الفحص لاستخراج JSON-LD كدليل.',
  fixCategory: 'schema',
  isFreePreview: true,
};
