import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN, canonicalPath, canonicalUrl } from './urls';

describe('canonicalUrl', () => {
  it('normalises the homepage to https apex with a trailing slash', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_ORIGIN}/`);
  });

  it('adds a trailing slash to a schema path', () => {
    expect(canonicalUrl('/schema/shopify-product')).toBe(
      `${SITE_ORIGIN}/schema/shopify-product/`
    );
  });

  it('keeps an already-slashed schema path unchanged', () => {
    expect(canonicalUrl('/schema/shopify-product/')).toBe(
      `${SITE_ORIGIN}/schema/shopify-product/`
    );
  });

  it('strips query strings', () => {
    expect(canonicalUrl('/schema/shopify-product?utm_source=x')).toBe(
      `${SITE_ORIGIN}/schema/shopify-product/`
    );
  });

  it('lowercases the path', () => {
    expect(canonicalUrl('/Schema/Foo')).toBe(`${SITE_ORIGIN}/schema/foo/`);
  });
});

describe('canonicalPath', () => {
  it('returns a site-relative path with the trailing-slash convention', () => {
    expect(canonicalPath('/schema/shopify-product')).toBe('/schema/shopify-product/');
    expect(canonicalPath('/')).toBe('/');
  });
});
