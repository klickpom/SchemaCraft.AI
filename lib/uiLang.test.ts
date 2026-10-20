import { describe, expect, it } from 'vitest';
import { resolveUiLang } from './uiLang';

describe('resolveUiLang', () => {
  it('keeps the Arabic homepage in Arabic', () => {
    expect(resolveUiLang('/ar/', 'en')).toBe('ar');
    expect(resolveUiLang('/ar', null)).toBe('ar');
  });

  it('keeps a saved choice on every other page', () => {
    expect(resolveUiLang('/ai-crawler-checker/', 'ar')).toBe('ar');
    expect(resolveUiLang('/about/', 'en')).toBe('en');
    expect(resolveUiLang('/', 'ar')).toBe('ar');
  });

  it('defaults to English when nothing was saved', () => {
    expect(resolveUiLang('/privacy/', null)).toBe('en');
    expect(resolveUiLang('/', 'nope')).toBe('en');
  });
});
