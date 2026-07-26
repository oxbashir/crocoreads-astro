import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import { resolveSupabaseEnv } from './env';

export function createSupabaseServerClient(cookies: AstroCookies, locals?: App.Locals) {
  const { url: supabaseUrl, anonKey: supabaseAnonKey } = resolveSupabaseEnv(locals);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env (local) or Cloudflare Pages environment variables (production).',
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key: string) {
        return cookies.get(key)?.value;
      },
      set(key: string, value: string, options: CookieOptions) {
        cookies.set(key, value, options);
      },
      remove(key: string, options: CookieOptions) {
        cookies.delete(key, options);
      },
    },
  });
}

export function createSupabaseAdminClient(locals?: App.Locals) {
  const { url: supabaseUrl, serviceRoleKey } = resolveSupabaseEnv(locals);

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin operations.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
