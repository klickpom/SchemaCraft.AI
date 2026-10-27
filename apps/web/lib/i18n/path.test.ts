import { describe, expect, it } from 'vitest';
import { swapLang, withLang } from './path';

describe('withLang', () => {
  it('prefixes site paths and leaves external links', () => {
    expect(withLang('/chatgpt-search/', 'ar')).toBe('/ar/chatgpt-search/');
    expect(withLang('/', 'ar')).toBe('/ar/');
    expect(withLang('/schema/shopify-product/', 'ar')).toBe('/ar/schema/shopify-product/');
    expect(withLang('/chatgpt-search/?url=1#x', 'ar')).toBe('/ar/chatgpt-search/?url=1#x');
    expect(withLang('https://example.com/a', 'ar')).toBe('https://example.com/a');
    expect(withLang('/chatgpt-search/', 'en')).toBe('/chatgpt-search/');
    expect(withLang('/ar/about/', 'ar')).toBe('/ar/about/');
  });
});

describe('swapLang', () => {
  it('switches the current page and keeps the audit query', () => {
    expect(swapLang('/chatgpt-search/')).toBe('/ar/chatgpt-search/');
    expect(swapLang('/ar/chatgpt-search/')).toBe('/chatgpt-search/');
    expect(swapLang('/ar/', '?url=https%3A%2F%2Fa.test%2F', '#audit')).toBe('/?url=https%3A%2F%2Fa.test%2F#audit');
    expect(swapLang('/', '?url=1')).toBe('/ar/?url=1');
    expect(swapLang('/schema/shopify-product')).toBe('/ar/schema/shopify-product/');
  });
});
