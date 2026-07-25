# Inovacure Blog — architecture & operations

An industrial-grade blog integrated into the existing Next.js site, authored in
**Sanity CMS**. It reuses the site's `hc-` design system so it reads as native,
and ships production SEO (metadata, JSON-LD, sitemap, robots, RSS, OG images).

> Full rationale and phase history: `~/.claude/plans/this-is-how-gpt-cozy-treasure.md`.

## Stack notes

- **Next.js 16** (upgraded from 15.5 during this work — Sanity Studio v6 requires
  React 19.2's `useEffectEvent`, which only Next 16's bundled React provides) +
  **React 19.2**.
- **Sanity** (`sanity`, `next-sanity`, `@sanity/client`, `@sanity/image-url`,
  `@portabletext/react`). Body content is **Portable Text**, not Markdown.
- Blog images use **`next/image`** with a Sanity CDN loader (hotspot-aware,
  AVIF/WebP, blur-up LQIP). Existing `/assets` images are untouched.

## First-time setup (required before content appears)

1. Create a Sanity project at https://www.sanity.io/manage (free tier is fine),
   dataset `production`.
2. Copy `.env.example` → `.env.local` and fill:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`,
     `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN` (API → Tokens, Viewer) — enables draft preview
   - `SANITY_REVALIDATE_SECRET` (any random string; also set on the webhook)
   - `SANITY_STUDIO_ENABLED=true` **only** where editors work (see Studio below)
3. In Sanity → API → CORS origins, add your site origin(s).
4. Regenerate types after schema changes: `npm run typegen`.

Until configured, the blog builds and renders graceful empty states — nothing
breaks.

## The Studio (`/studio`)

Embedded but **gated and non-discoverable** by three layers:
1. **Env gate** — the route 404s unless `SANITY_STUDIO_ENABLED === "true"`
   (`app/studio/[[...tool]]/page.tsx`, mirroring `/store`'s flag pattern).
2. **noindex** metadata + it is never linked from any nav/footer/sitemap.
3. **Sanity login** gates all editing regardless.

Enable it on a protected/admin deploy or locally; keep it off on the public site.

## Editorial lifecycle

```
Draft (in Studio)
  → Preview (Next draftMode + Sanity "drafts" perspective)
  → Publish (set publishedAt ≤ now)
  → Sanity webhook → POST /api/revalidate?secret=…
  → revalidatePath('/blog','layout')  (+ sitemap + rss)
  → Live
```

- A **future `publishedAt`** keeps a post as a draft: excluded from static
  params, sitemap and RSS, marked `noindex`, and 404 for anonymous visitors
  (visible only via Next draft mode).
- **Reading time, table of contents, and related posts are computed** — never
  stored, so there is nothing to keep in sync.

### Configure the publish webhook

Sanity → API → Webhooks → Create:
- URL: `https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- Trigger on: create / update / delete for `post`, `category`, `tag`, `author`
- Projection: `{ "_type": _type, "slug": slug.current }`

## Code map

| Area | Path |
|---|---|
| Sanity schemas | `sanity/schemas/*` (post, author, category, tag, objects/*) |
| Studio config | `sanity.config.ts`, gated route `app/studio/[[...tool]]/*` |
| Data-access layer (only place that queries Sanity) | `lib/blog/*` |
| GROQ queries | `lib/blog/queries.ts` |
| Fetchers (public API) | `lib/blog/posts.ts` |
| Metadata + JSON-LD | `lib/blog/metadata.ts` |
| Components | `components/blog/*` |
| Long-form typography | `components/blog/prose.css` (`.hc-prose`) |
| Blog layout/UI CSS | `components/blog/blog.css` |
| Routes | `app/blog/*` (index, `[slug]`, `category/[slug]`, `tag/[slug]`, `rss.xml`, OG) |
| SEO infra (site-wide) | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` |
| Revalidation webhook | `app/api/revalidate/route.ts` |

**Rule:** routes/components import only from `lib/blog/*` — never `@sanity/client`
directly. Everything from Sanity is strongly typed (`lib/blog/types.ts`); no
`any` crosses that boundary.

## Design-system integration

- The blog layout (`app/blog/layout.tsx`) mounts the shared `SiteRuntime` and
  imports `home.css` + `inner.css`, so scroll reveals (`data-reveal`) and the
  header/footer match the rest of the site.
- The TOC scrolls through **Lenis** (`window.__lenis`, published by
  `SiteRuntime`) so it doesn't fight the smooth-scroll loop, with a native
  `scrollIntoView` fallback under reduced motion.
- Editors cannot break layout: Portable Text is a curated whitelist (h2–h4,
  lists, quote, image, callout, code, table, FAQ, safe links) — no raw HTML or
  inline styles.

## Adding a post (editor)

Studio → Post → New. Fill title, slug, excerpt, cover (with alt), body,
author, ≥1 category, optional tags/FAQs, `publishedAt`. Optionally set one post
`featured` to headline the index. Publish → it goes live within seconds via the
webhook.

## Verification checklist

- `npm run build` clean; `npx tsc --noEmit` clean.
- `/blog`, an article, category/tag pages render; drafts 404 anonymously.
- `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml`, per-post `opengraph-image` resolve.
- Google Rich Results Test on an article → BlogPosting + BreadcrumbList (+ FAQPage).
- Reduced motion: article static & readable, TOC uses native scroll.
