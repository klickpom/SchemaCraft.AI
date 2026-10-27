import { describe, expect, it } from 'vitest';
import { extractJsonLdBlocks, validateJsonLd } from './jsonldValidator';

describe('extractJsonLdBlocks', () => {
  it('reads raw JSON, script tags and full HTML', () => {
    expect(extractJsonLdBlocks('{"@type":"Thing"}')).toHaveLength(1);
    const html = '<html><head><script type="application/ld+json">{"a":1}</script><script type="application/ld+json">{"b":2}</script></head></html>';
    expect(extractJsonLdBlocks(html)).toHaveLength(2);
    expect(extractJsonLdBlocks('<html><body>no schema</body></html>')).toHaveLength(0);
    expect(extractJsonLdBlocks('   ')).toHaveLength(0);
  });

  it('reports JSON syntax errors per block', () => {
    const result = validateJsonLd('{"@context":"https://schema.org", "@type": "Product",}');
    expect(result.parseErrors).toHaveLength(1);
    expect(result.counts.error).toBe(1);
  });
});

describe('validateJsonLd', () => {
  it('passes a complete product with no errors', () => {
    const result = validateJsonLd(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Trail Shoe',
      image: 'https://shop.test/shoe.jpg',
      description: 'Lightweight trail running shoe.',
      brand: { '@type': 'Brand', name: 'Acme' },
      sku: 'TS-1',
      offers: { '@type': 'Offer', price: '89.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    }));
    expect(result.counts.error).toBe(0);
    expect(result.counts.warning).toBe(0);
    expect(result.types).toEqual(['Product']);
  });

  it('flags missing required properties and bad values', () => {
    const result = validateJsonLd(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Shoe',
      image: '/shoe.jpg',
      offers: { '@type': 'Offer', price: '$1,299', priceCurrency: 'dollars' },
    }));
    const props = result.issues.map((i) => `${i.level}:${i.property}`);
    expect(props).toContain('error:price');
    expect(props).toContain('error:priceCurrency');
    expect(props).toContain('warning:image');
  });

  it('validates every node inside @graph and checks dates and ratings', () => {
    const result = validateJsonLd(JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', name: 'Acme', url: 'https://acme.test', logo: 'https://acme.test/l.png', sameAs: ['https://x.com/acme'] },
        { '@type': 'Article', headline: 'Hi', datePublished: '19/10/2026', author: { '@type': 'Person', name: 'Sam' } },
        { '@type': 'Product', name: 'X', aggregateRating: { '@type': 'AggregateRating', ratingValue: 7 } },
      ],
    }));
    const props = result.issues.map((i) => `${i.level}:${i.type}:${i.property}`);
    expect(props).toContain('error:Article:datePublished');
    expect(props).toContain('error:AggregateRating:ratingValue');
    expect(props).toContain('error:AggregateRating:ratingCount or reviewCount');
    expect(result.types).toEqual(expect.arrayContaining(['Organization', 'Article', 'Product']));
  });

  it('requires @context and notes deprecated types', () => {
    const result = validateJsonLd('{"@type":"HowTo","name":"Fix it"}');
    expect(result.issues.some((i) => i.property === '@context' && i.level === 'error')).toBe(true);
    expect(result.issues.some((i) => i.type === 'HowTo' && i.level === 'note')).toBe(true);
  });

  it('flags placeholder values', () => {
    const result = validateJsonLd('{"@context":"https://schema.org","@type":"Organization","name":"Your Company","url":"https://example.com"}');
    expect(result.issues.filter((i) => i.message.includes('placeholder')).length).toBeGreaterThanOrEqual(2);
  });
});
