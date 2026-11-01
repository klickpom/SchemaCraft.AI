import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { dryRunEnabled } from './mode';

export function supabaseBrowser(env: NodeJS.ProcessEnv = process.env): SupabaseClient | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || dryRunEnabled(env)) return null;
  return createClient(url, key);
}

export async function requestMagicLink(email: string, env: NodeJS.ProcessEnv = process.env): Promise<'dry-run' | 'sent'> {
  const client = supabaseBrowser(env);
  if (!client) return 'dry-run';
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.schemacraft-ai.site' },
  });
  if (error) throw new Error(error.message);
  return 'sent';
}

export async function requestGoogleSignIn(env: NodeJS.ProcessEnv = process.env): Promise<'unconfigured' | 'redirect'> {
  const client = supabaseBrowser(env);
  if (!client) return 'unconfigured';
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.schemacraft-ai.site' },
  });
  if (error) throw new Error(error.message);
  return 'redirect';
}
