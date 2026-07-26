export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );
}
