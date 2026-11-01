import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { radarAppLive, radarAppUrl } from './radarFunnel';

describe('radar funnel', () => {
  it('links to the signed-in app and does not add a marketing path', () => {
    const href = radarAppUrl('https://clinic.example/services');
    const url = new URL(href);
    expect(url.origin).toBe('https://app.schemacraft-ai.site');
    expect(url.pathname).toBe('/');
    expect(url.searchParams.get('url')).toBe('https://clinic.example/services');
    expect(url.host).not.toBe('schemacraft-ai.site');
  });

  it('shows the radar link only when the app host is marked live', () => {
    const previous = process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
    delete process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
    expect(radarAppLive()).toBe(false);
    expect(radarAppLive('')).toBe(false);
    expect(radarAppLive('0')).toBe(false);
    expect(radarAppLive('1')).toBe(true);
    if (previous === undefined) delete process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
    else process.env.NEXT_PUBLIC_RADAR_APP_LIVE = previous;
    const source = readFileSync(path.join(process.cwd(), 'components/audit/RadarFunnel.tsx'), 'utf8');
    expect(source).toContain('{live && (');
    expect(source).toContain('Download result card');
    expect(source).toContain('نزّل بطاقة النتيجة');
  });

  it('keeps the required labels on the existing report', () => {
    const source = readFileSync(path.join(process.cwd(), 'components/audit/RadarFunnel.tsx'), 'utf8');
    expect(source).toContain('Check what ChatGPT says about you');
    expect(source).toContain('اعرف ماذا يقول ChatGPT عنك');
    expect(source).toContain('radarAppUrl');
  });
});
