import {
  allCards as mdCards,
  allCategories as mdCategories,
  allTags as mdTags,
  findPost as mdFindPost,
} from "./source";
import {
  sanityCards,
  sanityCategories,
  sanityFindPost,
  sanityTags,
} from "./sanity/source";
import type { CategoryRef, Post, PostCard, TaxonomyRef } from "./types";

// HYBRID public data API. Posts come from BOTH sources — Markdown files in
// content/blog (Nischay's, git-authored) and Sanity (the client's web editor) —
// merged into one blog. Routes/components import ONLY from here. On a slug
// collision the Markdown file wins (it's the committed source of truth).
// Sanity reads degrade to empty when unconfigured, so the blog always works.

function byNewest(a: PostCard, b: PostCard): number {
  return +new Date(b.publishedAt) - +new Date(a.publishedAt);
}

async function mergedCards(): Promise<PostCard[]> {
  const [md, sa] = await Promise.all([
    Promise.resolve(mdCards()),
    sanityCards(),
  ]);
  const mdSlugs = new Set(md.map((c) => c.slug));
  return [...md, ...sa.filter((c) => !mdSlugs.has(c.slug))].sort(byNewest);
}

export async function getAllPostSlugs(): Promise<string[]> {
  return (await mergedCards()).map((p) => p.slug);
}

export async function getPostList(): Promise<PostCard[]> {
  return mergedCards();
}

export async function getFeaturedPost(): Promise<PostCard | null> {
  return (await mergedCards()).find((p) => p.featured) ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Markdown first (committed source of truth), then Sanity.
  return mdFindPost(slug) ?? (await sanityFindPost(slug));
}

export async function getPostsByCategory(slug: string): Promise<PostCard[]> {
  return (await mergedCards()).filter((p) =>
    p.categories.some((c) => c.slug === slug),
  );
}

export async function getPostsByTag(slug: string): Promise<PostCard[]> {
  return (await mergedCards()).filter((p) =>
    p.tags.some((t) => t.slug === slug),
  );
}

async function mergedCategories(): Promise<CategoryRef[]> {
  const [md, sa] = await Promise.all([
    Promise.resolve(mdCategories()),
    sanityCategories(),
  ]);
  const map = new Map<string, CategoryRef>();
  for (const c of [...md, ...sa]) if (!map.has(c.slug)) map.set(c.slug, c);
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getAllCategories(): Promise<CategoryRef[]> {
  return mergedCategories();
}

export async function getAllTags(): Promise<TaxonomyRef[]> {
  const [md, sa] = await Promise.all([
    Promise.resolve(mdTags()),
    sanityTags(),
  ]);
  const map = new Map<string, TaxonomyRef>();
  for (const t of [...md, ...sa]) if (!map.has(t.slug)) map.set(t.slug, t);
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getCategory(slug: string): Promise<CategoryRef | null> {
  return (await mergedCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getTag(slug: string): Promise<TaxonomyRef | null> {
  return (await getAllTags()).find((t) => t.slug === slug) ?? null;
}

/**
 * Related posts, ranked: manual override → same category → shared tags (by
 * overlap count) → newest, topped up with newest others. Spans both sources.
 */
export async function getRelatedPosts(
  post: Post,
  limit = 3,
): Promise<PostCard[]> {
  if (post.relatedManual?.length) {
    return post.relatedManual.slice(0, limit);
  }

  const cards = await mergedCards();
  const categorySlugs = post.categories.map((c) => c.slug);
  const tagSlugs = post.tags.map((t) => t.slug);

  const scored = cards
    .filter(
      (c) =>
        c.slug !== post.slug &&
        (c.categories.some((x) => categorySlugs.includes(x.slug)) ||
          c.tags.some((x) => tagSlugs.includes(x.slug))),
    )
    .map((c) => {
      const sameCategory = c.categories.some((x) =>
        categorySlugs.includes(x.slug),
      )
        ? 2
        : 0;
      const sharedTags = c.tags.filter((x) => tagSlugs.includes(x.slug)).length;
      return { post: c, score: sameCategory + sharedTags };
    })
    .sort((a, b) => b.score - a.score || byNewest(a.post, b.post))
    .map((s) => s.post);

  if (scored.length >= limit) return scored.slice(0, limit);

  const pickedIds = new Set([post._id, ...scored.map((p) => p._id)]);
  const filler = cards.filter((p) => !pickedIds.has(p._id));
  return [...scored, ...filler].slice(0, limit);
}
