import { describe, expect, it } from 'vitest';
import { generateBuyerQuestions } from './prompts';

describe('buyer question generator', () => {
  const input = {
    homepageText: 'Bright Smile is a family dental clinic. We fit clear aligners in one visit.',
    niche: 'dental clinic',
    city: 'Riyadh',
    language: 'en',
  };

  it('returns 30 questions across English, Egyptian Arabic, Gulf Arabic, and MSA', () => {
    const questions = generateBuyerQuestions(input);
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map((question) => question.locale))).toEqual(new Set(['en', 'ar-eg', 'ar-gulf', 'ar']));
    for (const question of questions) {
      expect(question.body).toContain('dental clinic');
      expect(question.body).toContain('Riyadh');
    }
    expect(questions.some((question) => question.body.includes('aligners'))).toBe(true);
    expect(questions.filter((question) => question.locale === 'ar-eg').some((question) => question.body.includes('فين'))).toBe(true);
    expect(questions.filter((question) => question.locale === 'ar-gulf').some((question) => question.body.includes('وين'))).toBe(true);
    expect(questions.filter((question) => question.locale === 'ar').some((question) => question.body.includes('ما أفضل'))).toBe(true);
  });

  it('puts Arabic first when the site language is Arabic and does not invent a phrase', () => {
    const questions = generateBuyerQuestions({ ...input, homepageText: '', language: 'ar' });
    expect(questions[0].locale).toBe('ar');
    expect(questions.some((question) => question.body.includes('aligners'))).toBe(false);
  });
});
