import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./render";
import type {
  AuthorFullModel,
  BlogImage,
  CategoryRef,
  FaqItem,
  Post,
  PostCard,
  PostSeo,
  TaxonomyRef,
} from "./types";

// The Markdown corpus lives in /content/blog. Each *.md file is one post; the
// filename (minus extension) is its slug. Frontmatter carries metadata; the body
// is Markdown. Everything is read + parsed once per process and memoised — the
// blog is fully static, so there is no live datastore to invalidate.

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---- Frontmatter shapes (author-facing; loosely typed, then normalised) ----

type RawImage = string | { src?: string; alt?: string; caption?: string; aspectRatio?: number };
type RawTaxonomy = string | { title: string; slug?: string; description?: string };

type Frontmatter = {
  title?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  coverImage?: RawImage;
  author?: { name?: string; role?: string; bio?: string; avatar?: RawImage };
  categories?: RawTaxonomy[];
  tags?: RawTaxonomy[];
  faqs?: FaqItem[];
  seo?: PostSeo;
  relatedManual?: string[];
};

function toImage(raw: RawImage | undefined, fallbackAlt = ""): BlogImage {
  if (!raw) return { src: "", alt: fallbackAlt };
  if (typeof raw === "string") return { src: raw, alt: fallbackAlt };
  return {
    src: raw.src ?? "",
    alt: raw.alt ?? fallbackAlt,
    caption: raw.caption,
    aspectRatio: raw.aspectRatio,
  };
}

function toTaxonomy(raw: RawTaxonomy): CategoryRef {
  if (typeof raw === "string") return { title: raw, slug: slugify(raw) };
  return {
    title: raw.title,
    slug: raw.slug ? slugify(raw.slug) : slugify(raw.title),
    description: raw.description,
  };
}

// ---- Parsed record (everything a Post needs, body kept separate for cards) --

type Record = {
  card: PostCard;
  post: Post;
  relatedSlugs: string[];
};

let cache: Record[] | undefined;

function readAll(): Record[] {
  if (cache) return cache;

  if (!fs.existsSync(BLOG_DIR)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const records: Record[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const source = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(source);
    const fm = data as Frontmatter;

    const { html, toc, readingTime } = renderMarkdown(content);

    const categories: TaxonomyRef[] = (fm.categories ?? []).map(toTaxonomy);
    const tags: TaxonomyRef[] = (fm.tags ?? []).map(toTaxonomy);
    const coverImage = toImage(fm.coverImage, fm.title ?? "");

    const author: AuthorFullModel = {
      name: fm.author?.name ?? "Inovacure Team",
      slug: slugify(fm.author?.name ?? "Inovacure Team"),
      role: fm.author?.role,
      bio: fm.author?.bio,
      avatar: fm.author?.avatar
        ? toImage(fm.author.avatar, fm.author?.name ?? "")
        : undefined,
    };

    const card: PostCard = {
      _id: slug,
      title: fm.title ?? slug,
      slug,
      excerpt: fm.excerpt ?? "",
      publishedAt: fm.publishedAt ?? "",
      featured: fm.featured === true,
      readingTime,
      coverImage,
      author: { name: author.name, slug: author.slug },
      categories,
      tags,
    };

    const post: Post = {
      ...card,
      author,
      updatedAt: fm.updatedAt ?? fm.publishedAt ?? "",
      bodyHtml: html,
      toc,
      faqs: fm.faqs,
      seo: fm.seo,
      relatedManual: undefined, // resolved after all cards exist
    };

    return { card, post, relatedSlugs: fm.relatedManual ?? [] };
  });

  // Resolve manual related-post references now that every card is known.
  const bySlug = new Map(records.map((r) => [r.card.slug, r.card]));
  for (const r of records) {
    const resolved = r.relatedSlugs
      .map((s) => bySlug.get(s))
      .filter((c): c is PostCard => Boolean(c));
    if (resolved.length) r.post.relatedManual = resolved;
  }

  cache = records;
  return cache;
}

// ---- Query helpers (published = has a slug + a past publishedAt) ------------

function isPublished(card: PostCard): boolean {
  return Boolean(card.publishedAt) && new Date(card.publishedAt) <= new Date();
}

function byNewest(a: PostCard, b: PostCard): number {
  return +new Date(b.publishedAt) - +new Date(a.publishedAt);
}

/** Published cards, newest first. */
export function allCards(): PostCard[] {
  return readAll()
    .map((r) => r.card)
    .filter(isPublished)
    .sort(byNewest);
}

/** A single post by slug — published or draft (caller enforces visibility). */
export function findPost(slug: string): Post | undefined {
  return readAll().find((r) => r.post.slug === slug)?.post;
}

/** Every unique category across published posts, alpha by title. */
export function allCategories(): CategoryRef[] {
  const map = new Map<string, CategoryRef>();
  for (const card of allCards()) {
    for (const c of card.categories) {
      if (!map.has(c.slug)) map.set(c.slug, c);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
}

/** Every unique tag across published posts, alpha by title. */
export function allTags(): TaxonomyRef[] {
  const map = new Map<string, TaxonomyRef>();
  for (const card of allCards()) {
    for (const t of card.tags) {
      if (!map.has(t.slug)) map.set(t.slug, { title: t.title, slug: t.slug });
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
}
