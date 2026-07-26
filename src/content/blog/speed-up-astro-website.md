---
title: "How to Speed Up Your Astro Website"
description: "Practical performance tactics for Astro sites — image delivery, JavaScript budgets, caching, and Core Web Vitals improvements solo publishers can implement today."
pubDate: 2026-01-15
author: "Osama"
tags: ["Web Development", "Astro", "Performance"]
draft: false
heroImage: "/images/blog/speed-up-astro-website.png"
---

A fast website earns more trust, ranks better, and keeps AdSense visitors on the page long enough for ads to matter. Astro is already one of the fastest ways to ship content-heavy sites because it ships zero JavaScript by default — but "fast by default" is not the same as "fast in production." Images, third-party scripts, fonts, and hosting choices still determine whether your Lighthouse score impresses or embarrasses you.

This guide covers practical steps solo bloggers and small publishers can take to speed up an Astro site without hiring a performance engineer.

## Measure before you optimize

Optimization without measurement is guesswork. Start with three free tools:

- **PageSpeed Insights** — shows field data (real users) and lab data for mobile and desktop
- **WebPageTest** — waterfall charts reveal slow assets and server response times
- **Chrome DevTools Performance panel** — inspect what blocks rendering on your machine

Run tests on your homepage, a typical article page, and your heaviest page (often one with many images or embeds). Write down LCP, INP, and CLS scores. You will revisit these after each change.

## Lean on Astro's island architecture

Astro's biggest performance advantage is partial hydration. Content pages should remain static HTML. Only interactive widgets — search modals, theme toggles, comment forms — need client-side JavaScript.

Audit every `.astro` and framework component on article templates:

- Remove unused React, Vue, or Svelte islands
- Use `client:visible` or `client:idle` instead of `client:load` when interaction is not immediate
- Keep navigation, footers, and article bodies free of client frameworks

A blog post that renders as pure HTML will almost always beat a React SPA on LCP and INP.

## Optimize images aggressively

Images are the number one cause of slow LCP on publisher sites. Astro supports the built-in `<Image />` component from `astro:assets`, which generates responsive sizes and modern formats at build time.

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---
<Image src={hero} alt="Descriptive alt text" widths={[400, 800, 1200]} formats={['webp', 'avif']} />
```

Follow these rules for every image on your site:

- Set explicit `width` and `height` (or aspect ratio) to prevent layout shift
- Use `loading="lazy"` for below-the-fold images; preload only the hero LCP image
- Compress source files before adding them to the repo — aim for under 200 KB per inline article image
- Serve hero images at the size they actually display, not at 4000px wide

For content imported from Markdown, consider a remark plugin or consistent frontmatter `heroImage` paths pointing to pre-optimized assets in `/public/images/blog/`.

## Control fonts and third-party scripts

Custom fonts improve branding but hurt performance if loaded carelessly. Limit yourself to one or two font families. Use `font-display: swap` and preload only the weights you use in above-the-fold content.

Third-party scripts — Google Analytics, AdSense, chat widgets — are often the largest INP offenders. Load them asynchronously and defer anything non-essential:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX" crossorigin="anonymous"></script>
```

Place ad scripts after main content in the layout. Avoid loading multiple analytics platforms. Every additional tag competes for the main thread on mobile devices.

## Enable compression and caching at the edge

Static Astro sites deploy cleanly to Netlify, Cloudflare Pages, Vercel, and similar hosts. Ensure your host serves:

- **Brotli or gzip compression** for HTML, CSS, and JS
- **Long cache headers** for hashed assets in `/_astro/`
- **CDN edge caching** for HTML on content that updates infrequently

On Cloudflare, a Page Rule or Cache Rule for static assets with `Cache-Control: public, max-age=31536000, immutable` keeps repeat visits fast worldwide.

## Split CSS and eliminate render-blocking resources

Astro scopes component CSS automatically. Avoid importing massive global stylesheets. If you use Tailwind, purge unused classes in production builds — the default Astro Tailwind integration handles this when configured correctly.

Inline critical CSS only when measurements prove it helps LCP on your specific template. For most Astro blogs, a single optimized CSS bundle plus fast HTML is sufficient.

## Preconnect to external origins

If you load fonts from Google Fonts, ads from Google, or images from a CMS CDN, add preconnect hints in your layout `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

Limit preconnects to three or four origins. Too many early connections waste bandwidth on pages that never use them.

## Build-time optimizations worth enabling

Check your `astro.config.mjs` for these options:

- **HTML compression** — `@astrojs/compressor` or host-level compression
- **Prefetching** — Astro's `<ClientRouter />` or `<link rel="prefetch">` for likely next pages
- **Sitemap generation** — does not speed up pages directly, but helps crawlers discover optimized URLs faster

Run `astro build` locally and inspect the `dist/` folder size. A blog with fifty articles should not produce hundreds of megabytes unless images are the culprit.

## Set a performance budget and enforce it

Define simple budgets and check them monthly:

| Metric | Target |
|--------|--------|
| LCP | under 2.5 s |
| INP | under 200 ms |
| CLS | under 0.1 |
| Total page weight (article) | under 1 MB |
| JavaScript transferred | under 100 KB on content pages |

When a new feature breaks the budget, either optimize it or remove it. Sidebar widgets, related-post carousels, and social share scripts are common offenders.

## Quick wins checklist

Work through this list in order — each item takes less than an hour for most Astro blogs:

1. Convert hero and inline images to WebP/AVIF with explicit dimensions
2. Remove unused JS islands from article layout
3. Defer AdSense and analytics scripts
4. Preload LCP image and primary font only
5. Enable CDN caching on your host
6. Re-test in PageSpeed Insights and compare scores

Speed is not a one-time project. Every new article, ad unit, and plugin adds weight. Treat performance as part of your publishing workflow — measure after major template changes, and keep Astro's static-first defaults at the center of your stack. Readers notice fast pages even if they cannot articulate why, and Google rewards the sites they stay on.
