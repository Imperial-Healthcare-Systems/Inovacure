import { defineQuery } from "next-sanity";

// GROQ lives here only. Projections are inlined (not interpolated) so Sanity
// TypeGen can resolve them. `published` = has a slug and publishedAt in the
// past; drafts (future publishedAt) are excluded from every public query.
// Reading time is computed server-side from the body via pt::text() so no body
// text is shipped to cards.

const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`;

// Lean card projection — shared shape for index/category/tag/related.
const CARD = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "featured": coalesce(featured, false),
  "readingTime": round(length(pt::text(body)) / 5 / 200) + 1,
  "coverImage": coverImage{
    _type, asset, hotspot, crop, alt, caption,
    "lqip": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
  "author": author->{ name, "slug": slug.current },
  "categories": categories[]->{ title, "slug": slug.current },
  "tags": tags[]->{ title, "slug": slug.current }
}`;

/** All published slugs — for generateStaticParams + sitemap. */
export const POST_SLUGS_QUERY = defineQuery(
  `*[${PUBLISHED}].slug.current`,
);

/** Newest-first list of published post cards. */
export const POST_LIST_QUERY = defineQuery(
  `*[${PUBLISHED}] | order(publishedAt desc) ${CARD}`,
);

/** The single featured post (newest with featured==true), else null. */
export const FEATURED_POST_QUERY = defineQuery(
  `*[${PUBLISHED} && featured == true] | order(publishedAt desc)[0] ${CARD}`,
);

/** Cards for a category slug. */
export const POSTS_BY_CATEGORY_QUERY = defineQuery(
  `*[${PUBLISHED} && $slug in categories[]->slug.current] | order(publishedAt desc) ${CARD}`,
);

/** Cards for a tag slug. */
export const POSTS_BY_TAG_QUERY = defineQuery(
  `*[${PUBLISHED} && $slug in tags[]->slug.current] | order(publishedAt desc) ${CARD}`,
);

/** Full article by slug (preview client resolves drafts). */
export const POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "updatedAt": _updatedAt,
    "featured": coalesce(featured, false),
    "readingTime": round(length(pt::text(body)) / 5 / 200) + 1,
    "coverImage": coverImage{
      _type, asset, hotspot, crop, alt, caption,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    "body": body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => { "slug": @.reference->slug.current }
      }
    },
    faqs,
    "author": author->{ name, "slug": slug.current, role, bio, avatar },
    "categories": categories[]->{ title, "slug": slug.current },
    "tags": tags[]->{ title, "slug": slug.current },
    seo,
    "relatedManual": relatedManual[]->{
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "featured": coalesce(featured, false),
      "readingTime": round(length(pt::text(body)) / 5 / 200) + 1,
      "coverImage": coverImage{
        _type, asset, hotspot, crop, alt, caption,
        "lqip": asset->metadata.lqip,
        "aspectRatio": asset->metadata.dimensions.aspectRatio
      },
      "author": author->{ name, "slug": slug.current },
      "categories": categories[]->{ title, "slug": slug.current },
      "tags": tags[]->{ title, "slug": slug.current }
    }
  }`,
);

/** Automatic related: same category OR shared tag, excluding self; newest first. */
export const RELATED_POSTS_QUERY = defineQuery(
  `*[${PUBLISHED} && slug.current != $slug &&
     (count((categories[]->slug.current)[@ in $categories]) > 0 ||
      count((tags[]->slug.current)[@ in $tags]) > 0)]
    | order(publishedAt desc)[0...6] ${CARD}`,
);

export const ALL_CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(title asc){ title, "slug": slug.current, description }`,
);

export const ALL_TAGS_QUERY = defineQuery(
  `*[_type == "tag"] | order(title asc){ title, "slug": slug.current }`,
);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]{ title, "slug": slug.current, description }`,
);

export const TAG_BY_SLUG_QUERY = defineQuery(
  `*[_type == "tag" && slug.current == $slug][0]{ title, "slug": slug.current }`,
);
