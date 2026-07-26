type EnvRecord = Record<string, string | undefined>;

function readRuntimeEnv(locals?: App.Locals): EnvRecord | undefined {
  const runtime = locals?.runtime?.env;
  if (!runtime || typeof runtime !== 'object') return undefined;
  return runtime as EnvRecord;
}

function readImportMetaEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readEnv(key: string, locals?: App.Locals): string | undefined {
  const runtimeValue = readRuntimeEnv(locals)?.[key];
  if (runtimeValue) return runtimeValue;
  return readImportMetaEnv(key);
}

export interface SupabaseEnv {
  url: string | undefined;
  anonKey: string | undefined;
  serviceRoleKey: string | undefined;
}

export function resolveSupabaseEnv(locals?: App.Locals): SupabaseEnv {
  return {
    url:
      readEnv('PUBLIC_SUPABASE_URL', locals) ??
      readEnv('SUPABASE_URL', locals),
    anonKey:
      readEnv('PUBLIC_SUPABASE_ANON_KEY', locals) ??
      readEnv('SUPABASE_ANON_KEY', locals) ??
      readEnv('SUPABASE_KEY', locals),
    serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY', locals),
  };
}

export function isSupabaseConfigured(locals?: App.Locals): boolean {
  const { url, anonKey } = resolveSupabaseEnv(locals);
  return Boolean(url && anonKey);
}
