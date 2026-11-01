import { describe, expect, it } from 'vitest';
import { parseMention } from './parser';

describe('mention parser', () => {
  it('reads an English answer with a list position, sentiment, competitor, and citations', () => {
    const answer = [
      '1. Pearl Clinic is often recommended. https://pearl.example/riyadh',
      '2. Bright Smile is the best choice for families. https://brightsmile.example/',
      '3. City Dental',
    ].join('\n');
    const parsed = parseMention(answer, 'Bright Smile', 'brightsmile.example');
    expect(parsed.brandMentioned).toBe(true);
    expect(parsed.domainMentioned).toBe(true);
    expect(parsed.position).toBe(2);
    expect(parsed.sentiment).toBe('positive');
    expect(parsed.competitors).toEqual(expect.arrayContaining(['Pearl Clinic is often recommended.', 'City Dental', 'pearl.example']));
    expect(parsed.citedUrls).toEqual([
      'https://pearl.example/riyadh',
      'https://brightsmile.example/',
    ]);
  });

  it('reads an Arabic answer without treating a missing domain as mentioned', () => {
    const answer = 'عيادة النور هي الأفضل في الرياض. قارن مع عيادة اللؤلؤ: https://pearl.example/ar';
    const parsed = parseMention(answer, 'عيادة النور', 'noor.example');
    expect(parsed.brandMentioned).toBe(true);
    expect(parsed.domainMentioned).toBe(false);
    expect(parsed.position).toBe(1);
    expect(parsed.sentiment).toBe('positive');
    expect(parsed.citedUrls).toEqual(['https://pearl.example/ar']);
    expect(parsed.competitors).toContain('pearl.example');
  });

  it('marks a negative mention and leaves an absent brand unassessed', () => {
    expect(parseMention('Avoid Bright Smile. Poor results and complaints.', 'Bright Smile', 'brightsmile.example').sentiment).toBe('negative');
    const absent = parseMention('Pearl Clinic is recommended in Riyadh.', 'Bright Smile', 'brightsmile.example');
    expect(absent.brandMentioned).toBe(false);
    expect(absent.domainMentioned).toBe(false);
    expect(absent.position).toBeNull();
    expect(absent.sentiment).toBe('not_assessed');
  });
});
