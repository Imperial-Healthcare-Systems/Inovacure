// Hand-authored view models — the source of truth for the exact shapes our GROQ
// projections return. Fetchers type their results against these so nothing
// `any` from Sanity leaks into routes/components. (Regenerate/compare with
// `npm run typegen`, which emits query-result types from the schema.)

import type { PortableTextBlock } from "@portabletext/react";

export type SanityImageRef = {
  _type: "image" | "figure";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
};

export type CoverImage = SanityImageRef & {
  alt: string;
  caption?: string;
  lqip?: string;
  aspectRatio?: number;
};

export type TaxonomyRef = {
  title: string;
  slug: string;
};

export type CategoryRef = TaxonomyRef & {
  description?: string;
};

export type AuthorCardModel = {
  name: string;
  slug: string;
};

export type AuthorFullModel = AuthorCardModel & {
  role?: string;
  bio?: string;
  avatar?: SanityImageRef;
};

/** Lean shape for listing/grids/related — never includes the body. */
export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured: boolean;
  readingTime: number;
  coverImage: CoverImage;
  author: AuthorCardModel;
  categories: TaxonomyRef[];
  tags: TaxonomyRef[];
};

export type FaqItem = { question: string; answer: string };

export type PostSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: SanityImageRef;
  noIndex?: boolean;
};

/** Full article — adds body, faqs, resolved author, seo, updatedAt. */
export type Post = Omit<PostCard, "author"> & {
  updatedAt: string;
  body: PortableTextBlock[];
  faqs?: FaqItem[];
  author: AuthorFullModel;
  seo?: PostSeo;
  relatedManual?: PostCard[];
};

export type TocEntry = { id: string; text: string; level: 2 | 3 };
