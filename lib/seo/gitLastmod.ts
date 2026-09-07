import { execSync } from 'child_process';

function gitDateForFile(file: string): string | null {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${file}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

/** Newest commit date among files, else build time. */
export function lastmodForFiles(files: string[]): string {
  const dates = files.map(gitDateForFile).filter((value): value is string => Boolean(value));
  if (dates.length === 0) return new Date().toISOString();
  return dates.sort().reverse()[0];
}
