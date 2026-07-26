/**
 * Import existing Markdown articles into Supabase.
 * Usage: npm run seed
 * Requires .env with PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const url = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing Supabase credentials. Set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const blogDir = join(process.cwd(), 'src/content/blog');

const { error: heroColumnError } = await supabase.from('articles').select('hero_image').limit(1);
const includeHeroImage = !heroColumnError;

if (heroColumnError) {
  console.warn(
    'hero_image column missing — run supabase/migrations/001_hero_image.sql in Supabase SQL Editor, then re-seed for hero images.',
  );
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith('[')) {
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      meta[key] = value === 'true';
    } else {
      meta[key] = value;
    }
  }

  return { meta, content: match[2].trim() };
}

const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
let imported = 0;

for (const file of files) {
  const raw = readFileSync(join(blogDir, file), 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) continue;

  const { meta, content } = parsed;
  const slug = basename(file, '.md');

  const row = {
    slug,
    title: meta.title,
    description: meta.description,
    content,
    author_name: meta.author ?? 'Osama',
    tags: meta.tags ?? [],
    draft: meta.draft ?? false,
    featured: meta.featured ?? false,
    pub_date: meta.pubDate ? new Date(meta.pubDate).toISOString() : new Date().toISOString(),
  };

  if (includeHeroImage && meta.heroImage) {
    row.hero_image = meta.heroImage;
  } else if (includeHeroImage) {
    row.hero_image = `/images/blog/${slug}.png`;
  }

  const { error } = await supabase.from('articles').upsert(row, { onConflict: 'slug' });
  if (error) {
    console.error(`Failed: ${slug}`, error.message);
  } else {
    console.log(`Imported: ${slug}`);
    imported++;
  }
}

console.log(`Done. ${imported}/${files.length} articles imported.`);
