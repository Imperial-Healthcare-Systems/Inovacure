import { sanityFetch, tags } from "./client";
import * as Q from "./queries";
import type { CategoryRef, Post, PostCard, TaxonomyRef } from "./types";

// The public data API. Routes/components import ONLY from here (never the
// Sanity client directly). Results are typed against the hand-authored view
// models in ./types, so nothing `any` escapes this boundary.

export async function getAllPostSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: Q.POST_SLUGS_QUERY,
    tags: [tags.all],
    fallback: [],
  });
}

export async function getPostList(): Promise<PostCard[]> {
  return sanityFetch<PostCard[]>({
    query: Q.POST_LIST_QUERY,
    tags: [tags.all],
    fallback: [],
  });
}

export async function getFeaturedPost(): Promise<PostCard | null> {
  return sanityFetch<PostCard | null>({
    query: Q.FEATURED_POST_QUERY,
    tags: [tags.all],
    fallback: null,
  });
}

export async function getPostBySlug(
  slug: string,
  preview = false,
): Promise<Post | null> {
  return sanityFetch<Post | null>({
    query: Q.POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.post(slug), tags.all],
    fallback: null,
    preview,
  });
}

export async function getPostsByCategory(slug: string): Promise<PostCard[]> {
  return sanityFetch<PostCard[]>({
    query: Q.POSTS_BY_CATEGORY_QUERY,
    params: { slug },
    tags: [tags.category(slug), tags.all],
    fallback: [],
  });
}

export async function getPostsByTag(slug: string): Promise<PostCard[]> {
  return sanityFetch<PostCard[]>({
    query: Q.POSTS_BY_TAG_QUERY,
    params: { slug },
    tags: [tags.tag(slug), tags.all],
    fallback: [],
  });
}

export async function getAllCategories(): Promise<CategoryRef[]> {
  return sanityFetch<CategoryRef[]>({
    query: Q.ALL_CATEGORIES_QUERY,
    tags: [tags.taxonomy],
    fallback: [],
  });
}

export async function getAllTags(): Promise<TaxonomyRef[]> {
  return sanityFetch<TaxonomyRef[]>({
    query: Q.ALL_TAGS_QUERY,
    tags: [tags.taxonomy],
    fallback: [],
  });
}

export async function getCategory(slug: string): Promise<CategoryRef | null> {
  return sanityFetch<CategoryRef | null>({
    query: Q.CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.taxonomy],
    fallback: null,
  });
}

export async function getTag(slug: string): Promise<TaxonomyRef | null> {
  return sanityFetch<TaxonomyRef | null>({
    query: Q.TAG_BY_SLUG_QUERY,
    params: { slug },
    tags: [tags.taxonomy],
    fallback: null,
  });
}

/**
 * Related posts, ranked: manual override → same category → shared tags (by
 * overlap count) → newest, then a featured/newest fallback to top up to `limit`.
 * The GROQ prefilters to same-category-or-shared-tag candidates; final ranking
 * is done in code where the scoring is clearer and testable.
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

  const candidates = await sanityFetch<PostCard[]>({
    query: Q.RELATED_POSTS_QUERY,
    params: { slug: post.slug, categories: categorySlugs, tags: tagSlugs },
    tags: [tags.all],
    fallback: [],
  });

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
  const filler = (await getPostList()).filter((p) => !pickedIds.has(p._id));
  return [...scored, ...filler].slice(0, limit);
}
