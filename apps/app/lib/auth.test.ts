import { describe, expect, it } from 'vitest';
import { requestGoogleSignIn, requestMagicLink } from './auth';
import { idFromEmail } from './ids';

describe('dry-run auth', () => {
  it('does not send mail or start Google when Supabase is unset', async () => {
    expect(await requestMagicLink('owner@example.com', {})).toBe('dry-run');
    expect(await requestGoogleSignIn({})).toBe('unconfigured');
  });

  it('keeps a stable id for the same email', () => {
    expect(idFromEmail('Owner@Example.com')).toBe(idFromEmail('owner@example.com'));
    expect(idFromEmail('owner@example.com')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});