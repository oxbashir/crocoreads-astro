import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { getPublishedArticles } from '../lib/articles';
import { SITE } from '../config/site';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const articles = await getPublishedArticles(supabase);

  const staticPages = ['', 'blog', 'about', 'contact', 'privacy', 'terms'];
  const urls = [
    ...staticPages.map((path) => `${SITE.url}/${path}`.replace(/\/$/, '') || SITE.url),
    ...articles.map((a) => `${SITE.url}/blog/${a.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
