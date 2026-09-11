import { describe, expect, it } from 'vitest';
import { homepageGraph, sitewideGraph } from './jsonld';

describe('json-ld graphs', () => {
  it('keeps FAQPage and HowTo off the sitewide graph', () => {
    const types = sitewideGraph()['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['Organization', 'WebSite']);
  });

  it('puts SoftwareApplication HowTo and FAQPage on the homepage graph only', () => {
    const types = homepageGraph()['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['SoftwareApplication', 'HowTo', 'FAQPage']);
  });
});
