import type { SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import type { Article, ArticleInput } from '../types/article';
import {
  getAllArticlesFromMarkdown,
  getArticleBySlugFromMarkdown,
  getPublishedArticlesFromMarkdown,
} from './articles-fallback';
import {
  createArticle as createSupabaseArticle,
  deleteArticle as deleteSupabaseArticle,
  getAllArticles as getAllSupabaseArticles,
  getArticleById as getSupabaseArticleById,
  getArticleBySlug as getSupabaseArticleBySlug,
  getPublishedArticles as getSupabasePublishedArticles,
  updateArticle as updateSupabaseArticle,
} from './articles';
import { createSupabaseServerClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { resolveHeroImage } from './hero-image';

function withHeroImage(article: Article): Article {
  return { ...article, hero_image: resolveHeroImage(article.slug, article.hero_image) };
}

export async function getSupabase(Astro: {
  cookies: AstroCookies;
}): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseServerClient(Astro.cookies);
}

export async function getPublishedArticles(
  supabase: SupabaseClient | null,
  tag?: string | null,
): Promise<Article[]> {
  if (supabase) {
    const articles = await getSupabasePublishedArticles(supabase, tag);
    return articles.map(withHeroImage);
  }
  return getPublishedArticlesFromMarkdown(tag);
}

export async function getAllArticles(supabase: SupabaseClient | null): Promise<Article[]> {
  if (supabase) {
    const articles = await getAllSupabaseArticles(supabase);
    return articles.map(withHeroImage);
  }
  return getAllArticlesFromMarkdown();
}

export async function getArticleBySlug(
  supabase: SupabaseClient | null,
  slug: string,
): Promise<Article | null> {
  if (supabase) {
    const article = await getSupabaseArticleBySlug(supabase, slug);
    return article ? withHeroImage(article) : null;
  }
  return getArticleBySlugFromMarkdown(slug);
}

export async function getArticleById(supabase: SupabaseClient, id: string) {
  return getSupabaseArticleById(supabase, id);
}

export async function createArticle(
  supabase: SupabaseClient,
  input: ArticleInput,
  authorId: string | null,
) {
  return createSupabaseArticle(supabase, input, authorId);
}

export async function updateArticle(
  supabase: SupabaseClient,
  id: string,
  input: Partial<ArticleInput>,
) {
  return updateSupabaseArticle(supabase, id, input);
}

export async function deleteArticle(supabase: SupabaseClient, id: string) {
  return deleteSupabaseArticle(supabase, id);
}

export { parsePubDate, slugify } from './articles';
