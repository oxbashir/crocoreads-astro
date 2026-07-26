import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { getSecret } from 'astro:env/server';
import { env as cloudflareEnv } from 'cloudflare:workers';
import { SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY } from '../../config/supabase';

type EnvRecord = Record<string, unknown>;

const ANON_KEY_NAMES = [
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_KEY',
] as const;

const SERVICE_KEY_NAMES = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SECRET_KEYS',
] as const;

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
  return (
    readCloudflareEnv(key) ??
    readProcessEnv(key) ??
    readImportMetaEnv(key)
  );
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
  const url =
    PUBLIC_SUPABASE_URL ||
    readEnv('PUBLIC_SUPABASE_URL') ||
    readEnv('SUPABASE_URL') ||
    SUPABASE_PROJECT_URL;

  const anonKey =
    PUBLIC_SUPABASE_ANON_KEY ||
    readFirstEnv(ANON_KEY_NAMES) ||
    SUPABASE_ANON_KEY;

  const serviceRoleKey =
    getSecret('SUPABASE_SERVICE_ROLE_KEY') ||
    readFirstEnv(SERVICE_KEY_NAMES);

  return { url, anonKey, serviceRoleKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = resolveSupabaseEnv();
  return Boolean(url && anonKey);
}
