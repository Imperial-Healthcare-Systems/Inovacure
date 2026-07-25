import type { Metadata } from "next";
import { urlForImage } from "./image";
import { BLOG_BASE, ORG_LOGO, ORG_NAME, SITE_URL, postUrl } from "./config";
import type { Post } from "./types";

// A published post shows in future-dated form as a draft; treat that + the SEO
// noIndex flag as the two ways a post is hidden from search.
export function isDraft(post: Pick<Post, "publishedAt">): boolean {
  return !post.publishedAt || new Date(post.publishedAt) > new Date();
}

function ogImageUrl(post: Post): string | undefined {
  const override = post.seo?.ogImage;
  const source = override?.asset ? override : post.coverImage;
  return urlForImage(source)?.width(1200).height(630).url() ?? undefined;
}

/** Per-post Next Metadata: title/description/canonical/OG/Twitter/robots. */
export function buildPostMetadata(post: Post): Metadata {
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const canonical = post.seo?.canonicalUrl || postUrl(post.slug);
  const noindex = isDraft(post) || post.seo?.noIndex === true;
  const image = ogImageUrl(post);

  return {
    title: `${title} — Inovacure`,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      // If no override, Next auto-injects the route's opengraph-image.
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** JSON-LD @graph: BlogPosting + BreadcrumbList + Person (+ FAQPage). */
export function buildPostJsonLd(post: Post) {
  const url = postUrl(post.slug);
  const image = urlForImage(post.coverImage)?.width(1200).url();

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.seo?.metaTitle || post.title,
      description: post.excerpt,
      ...(image ? { image: [image] } : {}),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: {
        "@type": "Person",
        name: post.author.name,
        ...(post.author.role ? { jobTitle: post.author.role } : {}),
      },
      publisher: {
        "@type": "Organization",
        name: ORG_NAME,
        logo: { "@type": "ImageObject", url: ORG_LOGO },
      },
      ...(post.tags?.length
        ? { keywords: post.tags.map((t) => t.title).join(", ") }
        : {}),
      articleSection: post.categories.map((c) => c.title),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_URL}${BLOG_BASE}`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  if (post.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
