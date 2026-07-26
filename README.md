# CrocoReads — AdSense-Ready Publishing Site

A modern publishing website for [crocoreads.com](https://crocoreads.com), built with **Astro**, **Tailwind CSS**, and **Supabase** (auth + database). Deploy free on Cloudflare Pages.

## Features

- **Supabase backend** — Postgres database, auth, article CRUD
- **Admin dashboard** at `/admin` — sign in, create, edit, delete articles
- Light theme UI with CrocoReads branding
- AdSense ad slot placeholders
- SEO: dynamic sitemap, robots.txt, Open Graph, JSON-LD
- Compliance pages: About, Contact, Privacy, Terms

## Quick start

### 1. Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the full script in [`supabase/schema.sql`](supabase/schema.sql)
3. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (seed script only — never expose in browser)

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Create admin user

1. Supabase Dashboard → **Authentication → Users → Add user**
2. Set email + password
3. In **SQL Editor**, promote to admin:

```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

### 4. Install and seed

```bash
npm install
npm run seed    # imports Markdown articles from src/content/blog/
npm run dev
```

- **Site:** [http://localhost:4321](http://localhost:4321)
- **Admin:** [http://localhost:4321/admin/login](http://localhost:4321/admin/login)

## Admin dashboard

| URL | Purpose |
|-----|---------|
| `/admin/login` | Sign in |
| `/admin/articles` | List all articles (drafts + published) |
| `/admin/articles/new` | Create article |
| `/admin/articles/[id]` | Edit or delete article |

Articles are stored in Supabase. Changes appear on the live site immediately — no rebuild required.

## Project structure

```
src/
├── lib/
│   ├── supabase/server.ts   # Supabase client (cookies / SSR)
│   ├── articles.ts          # Article queries & CRUD
│   └── markdown.ts          # Markdown → HTML
├── pages/
│   ├── admin/               # Protected admin routes
│   ├── blog/                # Public blog (reads Supabase)
│   └── sitemap.xml.ts       # Dynamic sitemap
supabase/schema.sql            # Database schema + RLS policies
scripts/seed.mjs               # Import Markdown → Supabase
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Cloudflare Pages → connect repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node.js version:** 22
4. Add environment variables in **Pages → Settings → Environment variables**:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for seeding in CI)

> **Note:** This project uses SSR (`output: 'server'`) with the Cloudflare adapter. Cloudflare Pages supports this automatically.

## Configuration

Edit [`src/config/site.ts`](src/config/site.ts) for site name, URL, AdSense IDs, and contact email.

## AdSense

See previous README sections for AdSense setup. Enable ads in `src/config/site.ts` after approval.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run seed` | Import Markdown articles into Supabase |

## Cost

| Item | Cost |
|------|------|
| Cloudflare Pages | Free |
| Supabase (free tier) | Free |
| Domain (Namecheap) | ~$10–15/year |
