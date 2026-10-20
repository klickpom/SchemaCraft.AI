import { describe, expect, it } from 'vitest';
import { SCHEMA_DEFINITIONS } from './schemaTypes';

describe('generator defaults', () => {
  it('does not invent a reviewer, a score, or social profiles', () => {
    const review = SCHEMA_DEFINITIONS.Review.generateJsonLd(SCHEMA_DEFINITIONS.Review.defaultValues);
    expect(JSON.stringify(review)).not.toMatch(/Marcus|Verified Reviewer|"5"/);
    expect(review).not.toHaveProperty('reviewRating');
    expect(review).not.toHaveProperty('author');

    const org = SCHEMA_DEFINITIONS.Organization.generateJsonLd(SCHEMA_DEFINITIONS.Organization.defaultValues);
    expect(org).not.toHaveProperty('sameAs');

    const product = SCHEMA_DEFINITIONS.Product.generateJsonLd({
      ...SCHEMA_DEFINITIONS.Product.defaultValues,
      ratingValue: '4.6',
    });
    expect(product.aggregateRating).toBeUndefined();
  });
});
