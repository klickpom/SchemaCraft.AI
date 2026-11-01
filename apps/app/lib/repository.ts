export interface SiteRecord {
  id: string;
  userId: string;
  domain: string;
  country: string;
  city: string;
  language: string;
  niche: string;
  brand: string;
  homepageText: string;
}

export interface PromptRecord {
  id: string;
  userId: string;
  siteId: string;
  body: string;
  locale: string;
  position: number;
}

export interface StoredCall {
  id: string;
  userId: string;
  siteId: string;
  promptId: string;
  engine: string;
  runIndex: number;
  rawAnswer: string;
  source: 'dry-run' | 'live';
  brandMentioned: boolean;
  domainMentioned: boolean;
  position: number | null;
  sentiment: string;
  competitors: string[];
  citedUrls: string[];
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export interface RadarRepository {
  listSites(userId: string): Promise<SiteRecord[]>;
  saveSite(site: SiteRecord): Promise<void>;
  listPrompts(userId: string, siteId: string): Promise<PromptRecord[]>;
  savePrompts(userId: string, siteId: string, prompts: PromptRecord[]): Promise<void>;
  listCalls(userId: string, siteId: string): Promise<StoredCall[]>;
  saveCalls(userId: string, calls: StoredCall[]): Promise<void>;
  spentUsd(userId: string): Promise<number>;
}

export class MemoryRepository implements RadarRepository {
  sites: SiteRecord[] = [];
  prompts: PromptRecord[] = [];
  calls: StoredCall[] = [];

  async listSites(userId: string) {
    return this.sites.filter((site) => site.userId === userId);
  }

  async saveSite(site: SiteRecord) {
    this.sites = this.sites.filter((row) => row.id !== site.id);
    this.sites.push(site);
  }

  async listPrompts(userId: string, siteId: string) {
    return this.prompts.filter((row) => row.userId === userId && row.siteId === siteId).sort((a, b) => a.position - b.position);
  }

  async savePrompts(userId: string, siteId: string, prompts: PromptRecord[]) {
    if (prompts.some((prompt) => prompt.userId !== userId || prompt.siteId !== siteId)) {
      throw new Error('Prompt owner does not match');
    }
    this.prompts = this.prompts.filter((row) => !(row.userId === userId && row.siteId === siteId));
    this.prompts.push(...prompts);
  }

  async listCalls(userId: string, siteId: string) {
    return this.calls.filter((row) => row.userId === userId && row.siteId === siteId);
  }

  async saveCalls(userId: string, calls: StoredCall[]) {
    if (calls.some((call) => call.userId !== userId)) throw new Error('Call owner does not match');
    this.calls.push(...calls);
  }

  async spentUsd(userId: string) {
    return this.calls.filter((call) => call.userId === userId).reduce((sum, call) => sum + call.costUsd, 0);
  }
}
