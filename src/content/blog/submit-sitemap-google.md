---
title: "How to Submit Your Sitemap to Google"
description: "Step-by-step instructions to generate, validate, and submit your XML sitemap in Google Search Console so new blog posts get indexed faster."
pubDate: 2026-06-10
author: "Osama"
tags: ["SEO", "Web Development", "Publishing"]
draft: false
heroImage: "/images/blog/submit-sitemap-google.svg"
---

You published ten solid articles. Google still shows zero impressions. Often the problem is not content quality — it is discovery. Search engines need a map of your URLs. An XML sitemap provides that map, and Google Search Console is where you hand it over.

Submitting a sitemap takes minutes but prevents weeks of waiting for crawlers to stumble onto pages through random links. For static sites and new domains, it is essential housekeeping. This guide walks through generating a sitemap, submitting it correctly, and fixing the errors that block indexing.

## What is an XML sitemap?

A sitemap is an XML file listing URLs you want search engines to crawl, optionally with metadata:

- `lastmod` — last modification date
- `changefreq` — how often the page changes (hint only; Google may ignore)
- `priority` — relative importance within your site (also a hint)

Example entry:

```xml
<url>
  <loc>https://example.com/blog/schema-markup-blog-articles/</loc>
  <lastmod>2026-01-15</lastmod>
</url>
```

Sitemaps do not guarantee indexing or ranking. They **invite** crawlers to known URLs, especially on new sites with few external backlinks.

## Do you need a sitemap?

Google recommends sitemaps for:

- New websites with limited links
- Sites with large archives or frequent updates
- Pages with rich media or news content
- Sites where not all pages are linked from navigation

If your blog is a handful of Markdown files on Astro, you still benefit — homepage and tag pages might not link to every post immediately. Submit the sitemap.

Exceptions: if your site has only five pages and perfect internal linking, crawlers may find everything without one — but submitting anyway costs nothing.

## Generating a sitemap on static sites

### Astro

The `@astrojs/sitemap` integration generates `sitemap-index.xml` and `sitemap-0.xml` at build time from your routes.

Install and configure in `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [sitemap()],
});
```

The `site` property must be your production URL — absolute links depend on it.

Exclude drafts and admin routes via filter options if needed.

### Other static generators

- **Next.js** — `next-sitemap` package
- **Hugo** — built-in sitemap template
- **Eleventy** — `@quasibit/eleventy-plugin-sitemap`

Manual sitemaps work for tiny sites but become error-prone beyond twenty URLs.

### Validate before submission

Open `https://yourdomain.com/sitemap-index.xml` after deploy. Confirm:

- URLs use HTTPS and your canonical domain (www vs non-www consistently)
- No 404 URLs listed
- No redirected URLs — list final destinations
- Draft or staging URLs are absent

Use an online XML validator or browse the file directly.

## robots.txt and sitemap reference

Your `robots.txt` should point crawlers to the sitemap:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap-index.xml
```

Place `robots.txt` in `public/`. Google discovers sitemaps via Search Console **and** this line — both are best practice.

Do not block `/blog/` in robots while listing those URLs in the sitemap. Contradictory signals waste crawl budget.

## Setting up Google Search Console

If you have not verified site ownership:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add a **property** — Domain property (covers all subdomains) or URL-prefix property (exact protocol and host)
3. Verify via DNS TXT record (domain) or HTML file / meta tag / Analytics (URL-prefix)

Domain verification is preferred for HTTPS and www consistency.

Wait until verification succeeds before submitting sitemaps.

## How to submit your sitemap

Steps in Search Console:

1. Select your property
2. Open **Indexing → Sitemaps** in the left menu
3. Enter the sitemap URL path: `sitemap-index.xml` (not the full domain again — the field appends to your property URL)
4. Click **Submit**

Status should change to **Success** within minutes to hours. "Couldn't fetch" means Google cannot retrieve the file — check deploy, HTTPS certificates, and firewall rules.

For large sites, sitemap index files split into multiple child sitemaps automatically — submit only the index.

## After submission: what happens next

Google crawls listed URLs based on priority, freshness signals, and site authority. New blogs may wait days before first indexing. Monitor:

### Pages report

**Indexing → Pages** shows indexed vs not indexed counts. Click reasons: "Discovered – currently not indexed" often means quality or crawl budget queues, not sitemap failure.

### URL Inspection tool

Paste an article URL → **Test live URL** → **Request indexing** for important new posts. Use sparingly — excessive requests do not force faster ranking.

Request indexing after major content updates too.

### Sitemaps report details

Shows last read date and discovered URL count. If discovered URLs stay zero, the sitemap path or format is wrong.

## Common sitemap errors and fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Couldn't fetch | 404, server error, blocked | Verify URL in browser, check CDN |
| Invalid XML | Malformed file | Regenerate; validate XML |
| URLs not allowed | Property mismatch | Submit under correct www/https property |
| Submitted URL blocked by robots | Disallow rule | Update robots.txt |
| Duplicate URLs | Trailing slash inconsistency | Pick one canonical format |

### www vs non-www

Search Console treats `https://example.com` and `https://www.example.com` as separate properties unless using domain property. Submit sitemap on the canonical host you redirect to.

### Staging sitemaps

Never submit staging URLs (`staging.example.com`) to production Search Console. Use password protection or `noindex` on staging; exclude from production builds.

## Sitemap best practices for bloggers

- **Update automatically on build** — Manual sitemaps rot quickly.
- **Include posts, tags, and important pages** — About and contact pages matter for trust.
- **Exclude thin or duplicate pages** — Tag pages with one post add little value; some publishers noindex them instead.
- **Keep `lastmod` accurate** — Astro sitemap integration reads file dates; update posts when content changes materially.
- **Resubmit after major migrations** — Platform changes need fresh sitemap reads.

## Bing and other search engines

Bing Webmaster Tools accepts the same sitemap URL. Submit once there for additional coverage with minimal effort.

## Checklist: first-time sitemap submission

- [ ] Production site live with HTTPS
- [ ] `site` URL configured in static generator
- [ ] Sitemap generates on build and is publicly accessible
- [ ] `robots.txt` references sitemap location
- [ ] Search Console property verified
- [ ] Sitemap submitted at Indexing → Sitemaps
- [ ] Three priority URLs inspected and indexing requested
- [ ] Analytics and monitoring connected

## Sitemap submission is not optional SEO trivia

It is the handshake between your publishing workflow and Google's crawler. Solo bloggers who automate sitemap generation on every deploy and verify Search Console weekly catch indexing problems before they cost months of invisible content.

Submit the sitemap today. Then focus back on writing — the map only helps if the destinations are worth visiting.
