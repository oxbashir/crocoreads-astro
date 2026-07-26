# CrocoReads — AdSense-Ready Publishing Site

A modern, light-themed publishing website built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and Markdown content. Designed for free hosting on Cloudflare Pages and Google AdSense monetization.

## Features

- Fast static site with zero JavaScript on article pages by default
- Markdown content collections with typed frontmatter
- Light theme UI with responsive navigation
- AdSense ad slot placeholders (header, in-article, sidebar, footer)
- SEO: sitemap, robots.txt, Open Graph, JSON-LD structured data
- Compliance pages: About, Contact, Privacy Policy, Terms of Service
- 5 starter articles on web development and productivity

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Project structure

```
src/
├── config/site.ts       # Site name, URL, AdSense settings
├── content/blog/        # Markdown articles
├── components/          # Header, Footer, AdSlot, PostCard, TOC
├── layouts/             # BaseLayout, PageLayout, PostLayout
└── pages/               # Routes (home, blog, about, contact, etc.)
public/
├── ads.txt              # AdSense authorization (update after approval)
└── robots.txt
```

## Configuration

Edit [`src/config/site.ts`](src/config/site.ts):

- `SITE.url` — your production domain
- `SITE.name`, `SITE.email`, `SITE.author` — site identity
- `ADSENSE.enabled` — set to `true` after AdSense approval
- `ADSENSE.clientId` — your `ca-pub-XXXXXXXXXXXXXXXX` ID
- `ADSENSE.slots` — ad unit slot IDs from AdSense dashboard

Update [`astro.config.mjs`](astro.config.mjs) `site` to match your domain.

Update [`public/ads.txt`](public/ads.txt):

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Update [`public/robots.txt`](public/robots.txt) sitemap URL to your domain.

## Writing articles

Create a file in `src/content/blog/`:

```markdown
---
title: "Article Title"
description: "SEO description under 160 characters."
pubDate: 2026-07-26
tags: ["Tag1", "Tag2"]
draft: false
---

Your content here.
```

Set `draft: true` to exclude from production builds.

## Deploy to Cloudflare Pages (free)

1. Push this repo to GitHub
2. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select your repository
4. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 22
5. Deploy
6. Add your custom domain under **Custom domains**
7. Point DNS to Cloudflare (or use Cloudflare as your registrar)

Every push to `main` triggers a new deployment automatically.

## Google AdSense setup

### Before applying

- [ ] Custom domain with HTTPS (required — free subdomains are rarely approved)
- [ ] About, Contact, Privacy Policy, and Terms pages published
- [ ] At least 15–20 quality original articles (5 starters included — add more)
- [ ] Site live for a few weeks with some organic traffic
- [ ] Google Search Console verified with sitemap submitted

### After approval

1. Set `ADSENSE.enabled = true` in `src/config/site.ts`
2. Add your publisher ID and slot IDs
3. Update `public/ads.txt` with your publisher ID
4. Rebuild and deploy
5. Verify ads render correctly on mobile and desktop

### Ad placement

Ads are placed in non-intrusive locations:

- Header banner (article pages)
- In-article rectangle (after content)
- Sidebar (desktop, sticky)
- Footer (all pages)

During development, placeholder boxes appear instead of real ads.

## Contact form

The contact page uses [Formspree](https://formspree.io). Create a free form and replace `YOUR_FORM_ID` in [`src/pages/contact.astro`](src/pages/contact.astro), or switch to a `mailto:` link.

## Commands

| Command         | Action                              |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start dev server at localhost:4321  |
| `npm run build` | Build production site to `./dist/`  |
| `npm run preview` | Preview production build locally |

## Cost

| Item | Cost |
|------|------|
| Cloudflare Pages hosting | Free |
| Backend / database | None needed |
| SSL | Free |
| Domain | ~$10–15/year |
| AdSense | Free |

## License

Content and code are yours to modify for your publishing site.
