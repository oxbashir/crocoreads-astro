import { env as cloudflareEnv } from 'cloudflare:workers';

type EnvRecord = Record<string, unknown>;

function readImportMetaEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readCloudflareEnv(key: string): string | undefined {
  const value = (cloudflareEnv as EnvRecord)[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readEnv(key: string): string | undefined {
  return readCloudflareEnv(key) ?? readImportMetaEnv(key);
}

export interface SupabaseEnv {
  url: string | undefined;
  anonKey: string | undefined;
  serviceRoleKey: string | undefined;
}

export function resolveSupabaseEnv(): SupabaseEnv {
  return {
    url: readEnv('PUBLIC_SUPABASE_URL') ?? readEnv('SUPABASE_URL'),
    anonKey:
      readEnv('PUBLIC_SUPABASE_ANON_KEY') ??
      readEnv('SUPABASE_ANON_KEY') ??
      readEnv('SUPABASE_KEY'),
    serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = resolveSupabaseEnv();
  return Boolean(url && anonKey);
}
