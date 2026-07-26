import type { SupabaseClient } from '@supabase/supabase-js';
import type { Article, ArticleInput } from '../../types/article';

export async function getPublishedArticles(supabase: SupabaseClient, tag?: string | null) {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('draft', false)
    .order('pub_date', { ascending: false });

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getAllArticles(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('pub_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(supabase: SupabaseClient, slug: string, includeDrafts = false) {
  let query = supabase.from('articles').select('*').eq('slug', slug).maybeSingle();

  const { data, error } = await query;
  if (error) throw error;
  if (!data) return null;

  const article = data as Article;
  if (!includeDrafts && article.draft) return null;
  return article;
}

export async function getArticleById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Article | null) ?? null;
}

export async function createArticle(
  supabase: SupabaseClient,
  input: ArticleInput,
  authorId: string | null,
) {
  const { data, error } = await supabase
    .from('articles')
    .insert({ ...input, author_id: authorId })
    .select()
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle(supabase: SupabaseClient, id: string, input: Partial<ArticleInput>) {
  const { data, error } = await supabase.from('articles').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export function parsePubDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00.000Z`).toISOString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
