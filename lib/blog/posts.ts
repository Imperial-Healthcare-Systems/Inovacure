import {
  allCards,
  allCategories,
  allTags,
  findPost,
} from "./source";
import type { CategoryRef, Post, PostCard, TaxonomyRef } from "./types";

// The public data API. Routes/components import ONLY from here (never the
// Markdown source layer directly). Functions stay `async` so the call sites are
// unchanged from the previous CMS-backed version, even though the corpus is now
// read synchronously from `content/blog/*.md`.

export async function getAllPostSlugs(): Promise<string[]> {
  return allCards().map((p) => p.slug);
}

export async function getPostList(): Promise<PostCard[]> {
  return allCards();
}

export async function getFeaturedPost(): Promise<PostCard | null> {
  return allCards().find((p) => p.featured) ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return findPost(slug) ?? null;
}

export async function getPostsByCategory(slug: string): Promise<PostCard[]> {
  return allCards().filter((p) => p.categories.some((c) => c.slug === slug));
}

export async function getPostsByTag(slug: string): Promise<PostCard[]> {
  return allCards().filter((p) => p.tags.some((t) => t.slug === slug));
}

export async function getAllCategories(): Promise<CategoryRef[]> {
  return allCategories();
}

export async function getAllTags(): Promise<TaxonomyRef[]> {
  return allTags();
}

export async function getCategory(slug: string): Promise<CategoryRef | null> {
  return allCategories().find((c) => c.slug === slug) ?? null;
}

export async function getTag(slug: string): Promise<TaxonomyRef | null> {
  return allTags().find((t) => t.slug === slug) ?? null;
}

/**
 * Related posts, ranked: manual override → same category → shared tags (by
 * overlap count) → newest, then a featured/newest fallback to top up to `limit`.
 */
export async function getRelatedPosts(
  post: Post,
  limit = 3,
): Promise<PostCard[]> {
  if (post.relatedManual?.length) {
    return post.relatedManual.slice(0, limit);
  }

  const categorySlugs = post.categories.map((c) => c.slug);
  const tagSlugs = post.tags.map((t) => t.slug);

  const candidates = allCards().filter(
    (c) =>
      c.slug !== post.slug &&
      (c.categories.some((x) => categorySlugs.includes(x.slug)) ||
        c.tags.some((x) => tagSlugs.includes(x.slug))),
  );

  const scored = candidates
    .map((c) => {
      const sameCategory = c.categories.some((x) =>
        categorySlugs.includes(x.slug),
      )
        ? 2
        : 0;
      const sharedTags = c.tags.filter((x) => tagSlugs.includes(x.slug)).length;
      return { post: c, score: sameCategory + sharedTags };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.post.publishedAt) - +new Date(a.post.publishedAt),
    )
    .map((s) => s.post);

  if (scored.length >= limit) return scored.slice(0, limit);

  // Top up with newest others (excluding self + already-picked).
  const pickedIds = new Set([post._id, ...scored.map((p) => p._id)]);
  const filler = allCards().filter((p) => !pickedIds.has(p._id));
  return [...scored, ...filler].slice(0, limit);
}
