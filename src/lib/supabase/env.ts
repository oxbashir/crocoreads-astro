import { env as cloudflareEnv } from 'cloudflare:workers';

type EnvRecord = Record<string, unknown>;

const ENV_KEYS = {
  url: ['PUBLIC_SUPABASE_URL', 'SUPABASE_URL'],
  anonKey: ['PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_KEY'],
  serviceRoleKey: ['SUPABASE_SERVICE_ROLE_KEY'],
} as const;

function readImportMetaEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readProcessEnv(key: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readCloudflareEnv(key: string): string | undefined {
  const value = (cloudflareEnv as EnvRecord)[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readEnv(key: string): string | undefined {
  return readCloudflareEnv(key) ?? readProcessEnv(key) ?? readImportMetaEnv(key);
}

function readFirstEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = readEnv(key);
    if (value) return value;
  }
  return undefined;
}

export interface SupabaseEnv {
  url: string | undefined;
  anonKey: string | undefined;
  serviceRoleKey: string | undefined;
}

export function resolveSupabaseEnv(): SupabaseEnv {
  return {
    url: readFirstEnv(ENV_KEYS.url),
    anonKey: readFirstEnv(ENV_KEYS.anonKey),
    serviceRoleKey: readFirstEnv(ENV_KEYS.serviceRoleKey),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = resolveSupabaseEnv();
  return Boolean(url && anonKey);
}
