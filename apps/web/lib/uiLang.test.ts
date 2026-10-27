import { describe, expect, it } from 'vitest';
import { resolveUiLang } from './uiLang';

describe('resolveUiLang', () => {
  it('treats every /ar path as Arabic even if English was stored', () => {
    expect(resolveUiLang('/ar/', 'en')).toBe('ar');
    expect(resolveUiLang('/ar', null)).toBe('ar');
    expect(resolveUiLang('/ar/chatgpt-search/', 'en')).toBe('ar');
  });

  it('treats every other path as English even if Arabic was stored', () => {
    expect(resolveUiLang('/chatgpt-search/', 'ar')).toBe('en');
    expect(resolveUiLang('/about/', 'ar')).toBe('en');
    expect(resolveUiLang('/', 'ar')).toBe('en');
  });

  it('defaults to English', () => {
    expect(resolveUiLang('/privacy/', null)).toBe('en');
    expect(resolveUiLang('/', 'nope')).toBe('en');
  });
});
