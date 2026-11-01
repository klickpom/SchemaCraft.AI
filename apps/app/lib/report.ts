export interface RunMention {
  engine: string;
  runIndex: number;
  mentioned: boolean;
  competitors: string[];
  citedUrls: string[];
}

export interface EngineShare {
  engine: string;
  shareOfVoice: number | null;
  min: number | null;
  max: number | null;
  runs: number;
  mentioned: number;
}

export function percent(part: number, whole: number): number {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function shareOfVoice(runs: RunMention[]): EngineShare[] {
  const engines = [...new Set(runs.map((run) => run.engine))];
  return engines.map((engine) => {
    const rows = runs.filter((run) => run.engine === engine);
    if (rows.length === 0) {
      return { engine, shareOfVoice: null, min: null, max: null, runs: 0, mentioned: 0 };
    }
    const mentioned = rows.filter((row) => row.mentioned).length;
    const indexes = [...new Set(rows.map((row) => row.runIndex))];
    const perRun = indexes.map((index) => {
      const slice = rows.filter((row) => row.runIndex === index);
      return percent(slice.filter((row) => row.mentioned).length, slice.length);
    });
    return {
      engine,
      shareOfVoice: percent(mentioned, rows.length),
      min: Math.min(...perRun),
      max: Math.max(...perRun),
      runs: rows.length,
      mentioned,
    };
  });
}

export function topCounts(values: string[], limit = 5): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const name = value.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function hostOfCitedUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
