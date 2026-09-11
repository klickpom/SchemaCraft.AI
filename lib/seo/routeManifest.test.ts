import { describe, expect, it } from 'vitest';
import { listPublicRoutes } from './routeManifest';
import { canonicalUrl } from './urls';

describe('route manifest', () => {
  it('emits trailing-slash canonical URLs for every live page', () => {
    const routes = listPublicRoutes();
    expect(routes.length).toBeGreaterThan(1);
    for (const route of routes) {
      const url = canonicalUrl(route.path);
      expect(url.startsWith('https://schemacraft-ai.site/')).toBe(true);
      expect(url.endsWith('/')).toBe(true);
      expect(url.includes('?')).toBe(false);
      expect(url.includes('#')).toBe(false);
    }
  });

  it('includes trust pages and the JSON-LD hub once', () => {
    const urls = listPublicRoutes().map((route) => canonicalUrl(route.path));
    expect(urls).toEqual(expect.arrayContaining([
      'https://schemacraft-ai.site/about/',
      'https://schemacraft-ai.site/privacy/',
      'https://schemacraft-ai.site/terms/',
      'https://schemacraft-ai.site/json-ld-generator/',
    ]));
  });

  it('includes the shopify generator once', () => {
    const urls = listPublicRoutes().map((route) => canonicalUrl(route.path));
    const shopify = urls.filter((url) => url.includes('/schema/shopify-product/'));
    expect(shopify).toEqual(['https://schemacraft-ai.site/schema/shopify-product/']);
  });
});
