import { describe, expect, it } from 'vitest';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { arabicSchema } from './schemaAr';

describe('arabicSchema', () => {
  it('translates every programmatic page without leaving English impact labels', () => {
    for (const page of Object.values(PROGRAMMATIC_SEO_PAGES)) {
      const ar = arabicSchema(page);
      expect(ar.h1).not.toBe(page.h1);
      expect(ar.blufSummary).not.toBe(page.blufSummary);
      expect(ar.faqs[0]?.question).not.toBe(page.faqs[0]?.question);
      for (const spec of ar.technicalSpecs) {
        expect(spec.requirement === 'إلزامي' || spec.requirement === 'مُستحسن').toBe(true);
        expect(spec.googleImpact).not.toMatch(/Triggers|Renders|Unlocks|Displays|Shows|Pins|Featured/);
      }
    }
  });
});
