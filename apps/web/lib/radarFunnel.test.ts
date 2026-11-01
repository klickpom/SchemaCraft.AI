import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { radarAppUrl, radarBlock, radarDownloadLabel } from './radarFunnel';

const RADAR_COPY = [
  'See whether AI answers mention this site',
  'The button opens the radar',
  'Check what ChatGPT says about you',
  'انظر هل تذكر إجابات الذكاء الاصطناعي هذا الموقع',
  'الزر يفتح الرادار',
  'اعرف ماذا يقول ChatGPT عنك',
];

describe('radar funnel', () => {
  it('links to the signed-in app and does not add a marketing path', () => {
    const href = radarAppUrl('https://clinic.example/services');
    const url = new URL(href);
    expect(url.origin).toBe('https://app.schemacraft-ai.site');
    expect(url.pathname).toBe('/');
    expect(url.searchParams.get('url')).toBe('https://clinic.example/services');
    expect(url.host).not.toBe('schemacraft-ai.site');
  });

  it('renders only the result card unless the app host is marked live', () => {
    const previous = process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
    const source = readFileSync(path.join(process.cwd(), 'components/audit/RadarFunnel.tsx'), 'utf8');
    try {
      for (const flag of [undefined, '', '0'] as const) {
        if (flag === undefined) delete process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
        else process.env.NEXT_PUBLIC_RADAR_APP_LIVE = flag;
        for (const lang of ['en', 'ar'] as const) {
          expect(radarBlock(lang, 'https://acme.example/'), `${flag ?? 'unset'} ${lang}`).toBeNull();
          expect(radarDownloadLabel(lang).length).toBeGreaterThan(0);
        }
      }
      for (const phrase of RADAR_COPY) expect(source).not.toContain(phrase);
      expect(source).toContain('if (!block) return download');
      expect(source).toContain('radarDownloadLabel');

      process.env.NEXT_PUBLIC_RADAR_APP_LIVE = '1';
      const english = radarBlock('en', 'https://acme.example/');
      const arabic = radarBlock('ar', 'https://acme.example/');
      expect(english).toMatchObject({
        title: 'See whether AI answers mention this site',
        body: expect.stringContaining('The button opens the radar'),
        linkLabel: 'Check what ChatGPT says about you',
        href: 'https://app.schemacraft-ai.site/?url=https%3A%2F%2Facme.example%2F',
      });
      expect(arabic).toMatchObject({
        title: 'انظر هل تذكر إجابات الذكاء الاصطناعي هذا الموقع',
        body: expect.stringContaining('الزر يفتح الرادار'),
        linkLabel: 'اعرف ماذا يقول ChatGPT عنك',
        href: 'https://app.schemacraft-ai.site/?url=https%3A%2F%2Facme.example%2F',
      });
      expect(radarDownloadLabel('en')).toBe('Download result card');
      expect(radarDownloadLabel('ar')).toBe('نزّل بطاقة النتيجة');
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_RADAR_APP_LIVE;
      else process.env.NEXT_PUBLIC_RADAR_APP_LIVE = previous;
    }
  });
});