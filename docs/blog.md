# Inovacure Blog — architecture & operations

A file-based blog integrated into the Next.js site. Posts are authored as
**Markdown files** in [`content/blog/`](../content/blog) — no external CMS, no
database, no runtime service. It reuses the site's `hc-` design system so it
reads as native, and ships production SEO (metadata, JSON-LD, sitemap, robots,
RSS, OG images).

## Stack notes

- **Next.js 16** + **React 19.2**.
- Content: **Markdown** (`marked`) with **`gray-matter`** frontmatter and
  **`github-slugger`** for stable heading ids. Bodies are rendered to HTML once
  (build/request time) and styled by `.hc-prose`.
- Blog cover/author images use **`next/image`** against files under `/public`
  (referenced by path in frontmatter). Existing `/assets` images are reused.

No setup or credentials are required — the blog builds and renders from the
Markdown files as-is.

## Authoring a post

Create `content/blog/<slug>.md`. The **filename is the slug** (`my-post.md` →
`/blog/my-post`). Frontmatter drives everything; the body is Markdown.

```markdown
---
title: "Your headline"
excerpt: "One–two sentence summary used on cards, meta description and OG."
publishedAt: "2026-07-20"      # a FUTURE date keeps the post a draft (404 + noindex)
updatedAt: "2026-07-22"        # optional
featured: true                 # optional — one featured post headlines /blog
coverImage:
  src: "/assets/imagery/consult-at-screen.jpg"   # a path under /public
  alt: "Descriptive alt text"
  caption: "Optional caption"                     # optional
author:
  name: "Inovacure Medical Team"
  role: "Inovacure Pharmaceuticals"               # optional
  bio: "Shown in the byline card."                # optional
  avatar: "/assets/logo-ic.svg"                   # optional (path under /public)
categories: ["Eye Care"]       # titles; slugs are derived automatically
tags: ["dry eyes", "screen time"]
faqs:                          # optional — renders an FAQ block + FAQPage JSON-LD
  - question: "…?"
    answer: "…"
seo:                          # all optional
  metaTitle: "…"
  metaDescription: "…"
  canonicalUrl: "…"
  ogImage: { src: "/assets/…", alt: "…" }
  noIndex: false
relatedManual: ["other-slug"] # optional — overrides automatic related posts
---

Body starts here. Standard Markdown:

## A section heading        (h2/h3 headings become the table of contents)

Paragraphs, **bold**, _italic_, [links](https://example.com), lists,
`inline code`, fenced code blocks, GFM tables, blockquotes and images all work.
```

Add the post's images under `public/` and reference them by absolute path
(e.g. `/blog/diagram.webp`). Inline images are lazy-loaded automatically.

## What's computed (never stored)

- **Reading time** — from the body word count.
- **Table of contents** — from h2/h3 headings, with matching anchor ids.
- **Related posts** — `relatedManual` if set, else ranked by shared
  category/tags then recency (see `lib/blog/posts.ts`).
- **Draft state** — a post with no `publishedAt` or a future one is excluded
  from listing, sitemap, RSS and static params, and 404s publicly.

## Publishing

Content is static. To publish, add/edit the Markdown file and **rebuild/redeploy**
(`pnpm build`). There is no webhook or revalidation endpoint — a new deploy is
the publish step.

## Code map

| Area | Path |
|---|---|
| Markdown corpus | `content/blog/*.md` |
| Data-access layer (public API) | `lib/blog/posts.ts` |
| Markdown → HTML + TOC + reading time | `lib/blog/render.ts` |
| File reading + frontmatter → typed models | `lib/blog/source.ts` |
| View-model types | `lib/blog/types.ts` |
| Metadata + JSON-LD | `lib/blog/metadata.ts` |
| Components | `components/blog/*` |
| Long-form typography | `components/blog/prose.css` (`.hc-prose`) |
| Blog layout/UI CSS | `components/blog/blog.css` |
| Routes | `app/blog/*` (index, `[slug]`, `category/[slug]`, `tag/[slug]`, `rss.xml`, OG) |
| SEO infra (site-wide) | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` |

**Rule:** routes/components import blog data only from `lib/blog/posts.ts` —
never the source/render layer directly. Everything is strongly typed
(`lib/blog/types.ts`); no `any` crosses that boundary.

## Design-system integration

- The blog layout (`app/blog/layout.tsx`) mounts the shared `SiteRuntime` and
  imports `home.css` + `inner.css`, so scroll reveals (`data-reveal`) and the
  header/footer match the rest of the site.
- The TOC scrolls through **Lenis** (`window.__lenis`, published by
  `SiteRuntime`) with a native `scrollIntoView` fallback under reduced motion.
- Rendering is a curated Markdown pipeline (headings, lists, quotes, tables,
  code, images, safe links) — authors write Markdown, not raw HTML.

## Verification checklist

- `pnpm build` clean; `npx tsc --noEmit` clean.
- `/blog`, an article, category/tag pages render; future-dated posts 404.
- `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`, per-post `opengraph-image` resolve.
- Google Rich Results Test on an article → BlogPosting + BreadcrumbList (+ FAQPage).
- Reduced motion: article static & readable, TOC uses native scroll.
