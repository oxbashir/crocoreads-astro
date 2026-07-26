import { getCollection } from 'astro:content';
import type { Article } from '../types/article';
import { resolveHeroImage } from './hero-image';

function mapMarkdownToArticle(
  id: string,
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    author: string;
    tags: string[];
    draft: boolean;
    featured: boolean;
    heroImage?: string;
  },
  content: string,
): Article {
  const pubDate = data.pubDate.toISOString();
  const updatedAt = (data.updatedDate ?? data.pubDate).toISOString();

  return {
    id,
    slug: id,
    title: data.title,
    description: data.description,
    content,
    author_id: null,
    author_name: data.author,
    tags: data.tags,
    draft: data.draft,
    featured: data.featured,
    hero_image: resolveHeroImage(id, data.heroImage),
    pub_date: pubDate,
    updated_at: updatedAt,
    created_at: pubDate,
  };
}

async function getMarkdownArticles(includeDrafts = false): Promise<Article[]> {
  const posts = await getCollection('blog', ({ data }) => includeDrafts || !data.draft);

  return posts.map((post) =>
    mapMarkdownToArticle(post.id, post.data, post.body ?? ''),
  );
}

export async function getPublishedArticlesFromMarkdown(tag?: string | null): Promise<Article[]> {
  const articles = await getMarkdownArticles(false);
  const sorted = articles.sort(
    (a, b) => new Date(b.pub_date).valueOf() - new Date(a.pub_date).valueOf(),
  );

  if (!tag) return sorted;
  return sorted.filter((article) => article.tags.includes(tag));
}

export async function getArticleBySlugFromMarkdown(slug: string): Promise<Article | null> {
  const articles = await getPublishedArticlesFromMarkdown();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getAllArticlesFromMarkdown(): Promise<Article[]> {
  const articles = await getMarkdownArticles(true);
  return articles.sort(
    (a, b) => new Date(b.pub_date).valueOf() - new Date(a.pub_date).valueOf(),
  );
}
