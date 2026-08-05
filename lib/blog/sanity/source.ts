import "server-only";
import { sanityFetch } from "./client";
import { POST_BY_SLUG_QUERY, POST_LIST_QUERY } from "./queries";
import { renderPortableText } from "./render";
import { toBlogImage } from "./image";
import type {
  AuthorFullModel,
  CategoryRef,
  FaqItem,
  Post,
  PostCard,
  PostSeo,
  TaxonomyRef,
} from "../types";

// Sanity-backed source. Every function returns Nischay's Post/PostCard shape so
// posts.ts can merge these with the Markdown source transparently. Reads are
// tagged "posts" and revalidated on publish via /api/revalidate.

const TAG = "posts";

type RawImage = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
  aspectRatio?: number;
} | null;
type RawTax = { title: string; slug: string; description?: string };
type RawCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  featured?: boolean;
  readingTime?: number;
  coverImage?: RawImage;
  author?: { name?: string; slug?: string };
  categories?: RawTax[];
  tags?: RawTax[];
};
type RawPost = RawCard & {
  updatedAt?: string;
  body?: never[];
  faqs?: FaqItem[];
  author?: { name?: string; slug?: string; role?: string; bio?: string; avatar?: RawImage };
  seo?: (PostSeo & { ogImage?: RawImage }) | null;
  relatedManual?: RawCard[];
};

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function toCard(raw: RawCard): PostCard {
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    publishedAt: raw.publishedAt ?? "",
    featured: raw.featured ?? false,
    readingTime: raw.readingTime ?? 1,
    coverImage: toBlogImage(raw.coverImage, raw.title),
    author: {
      name: raw.author?.name ?? "Inovacure Team",
      slug: raw.author?.slug ?? slugify(raw.author?.name ?? "Inovacure Team"),
    },
    categories: (raw.categories ?? []).map((c) => ({
      title: c.title,
      slug: c.slug,
      description: c.description,
    })),
    tags: (raw.tags ?? []).map((t) => ({ title: t.title, slug: t.slug })),
  };
}

function toPost(raw: RawPost): Post {
  const card = toCard(raw);
  const { html, toc, readingTime } = renderPortableText(raw.body);
  const author: AuthorFullModel = {
    name: raw.author?.name ?? "Inovacure Team",
    slug: card.author.slug,
    role: raw.author?.role,
    bio: raw.author?.bio,
    avatar: raw.author?.avatar
      ? toBlogImage(raw.author.avatar, raw.author?.name ?? "")
      : undefined,
  };
  return {
    ...card,
    readingTime,
    author,
    updatedAt: raw.updatedAt ?? raw.publishedAt ?? "",
    bodyHtml: html,
    toc,
    faqs: raw.faqs,
    seo: raw.seo
      ? {
          metaTitle: raw.seo.metaTitle,
          metaDescription: raw.seo.metaDescription,
          canonicalUrl: raw.seo.canonicalUrl,
          noIndex: raw.seo.noIndex,
          ogImage: raw.seo.ogImage ? toBlogImage(raw.seo.ogImage) : undefined,
        }
      : undefined,
    relatedManual: (raw.relatedManual ?? []).map(toCard),
  };
}

export async function sanityCards(): Promise<PostCard[]> {
  const rows = await sanityFetch<RawCard[]>({
    query: POST_LIST_QUERY,
    tags: [TAG],
    fallback: [],
  });
  return rows.map(toCard);
}

export async function sanityFindPost(slug: string): Promise<Post | null> {
  const raw = await sanityFetch<RawPost | null>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [TAG, `post:${slug}`],
    fallback: null,
  });
  return raw ? toPost(raw) : null;
}

/** Categories/tags that have at least one published Sanity post. */
export async function sanityCategories(): Promise<CategoryRef[]> {
  const map = new Map<string, CategoryRef>();
  for (const card of await sanityCards()) {
    for (const c of card.categories) if (!map.has(c.slug)) map.set(c.slug, c);
  }
  return [...map.values()];
}

export async function sanityTags(): Promise<TaxonomyRef[]> {
  const map = new Map<string, TaxonomyRef>();
  for (const card of await sanityCards()) {
    for (const t of card.tags) if (!map.has(t.slug)) map.set(t.slug, t);
  }
  return [...map.values()];
}
