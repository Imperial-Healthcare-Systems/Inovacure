// Hand-authored view models — the source of truth for the shapes the blog data
// layer returns. Posts are authored as Markdown files in `content/blog/*.md`
// (frontmatter + body); `lib/blog/source.ts` parses them into these models so
// nothing untyped leaks into routes/components.

/** A local image referenced from Markdown frontmatter. `src` is a path under
 *  /public (e.g. "/blog/cover.webp") or an absolute URL. */
export type BlogImage = {
  src: string;
  alt: string;
  caption?: string;
  /** width/height ratio for the fixed media well; defaults to 16/9. */
  aspectRatio?: number;
};

/** Kept as an alias so existing component prop names read naturally. */
export type CoverImage = BlogImage;

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
  avatar?: BlogImage;
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
  ogImage?: BlogImage;
  noIndex?: boolean;
};

export type TocEntry = { id: string; text: string; level: 2 | 3 };

/** Full article — adds the rendered body (+ its TOC), faqs, resolved author,
 *  seo, updatedAt. `bodyHtml` is pre-rendered Markdown; `toc` is derived from
 *  its h2/h3 headings so anchors always match. */
export type Post = Omit<PostCard, "author"> & {
  updatedAt: string;
  bodyHtml: string;
  toc: TocEntry[];
  faqs?: FaqItem[];
  author: AuthorFullModel;
  seo?: PostSeo;
  relatedManual?: PostCard[];
};
