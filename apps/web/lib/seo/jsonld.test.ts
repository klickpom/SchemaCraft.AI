import { describe, expect, it } from 'vitest';
import { homepageGraph, sitewideGraph } from './jsonld';

describe('json-ld graphs', () => {
  it('keeps FAQPage and HowTo off the sitewide graph', () => {
    const types = sitewideGraph()['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['Organization', 'WebSite']);
  });

  it('describes the free audit on the homepage graph, with an FAQPage matching the visible FAQ', () => {
    const graph = homepageGraph()['@graph'] as Record<string, unknown>[];
    expect(graph.map((node) => node['@type'])).toEqual(['WebPage', 'WebApplication', 'FAQPage']);
    expect((graph[1].offers as { price: string }).price).toBe('0');
    const ar = homepageGraph('ar')['@graph'] as Record<string, unknown>[];
    expect(ar[0].url).toBe('https://schemacraft-ai.site/ar/');
    expect((ar[2].mainEntity as unknown[]).length).toBeGreaterThan(5);
  });
});
