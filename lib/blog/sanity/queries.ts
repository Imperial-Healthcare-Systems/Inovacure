// GROQ for the site's read layer. Projections return raw-ish fields that the
// source layer maps into Nischay's Post/PostCard shape. Only published posts
// (past publishedAt) are returned.

const PUBLISHED = `_type == "post" && defined(slug.current) && publishedAt <= now()`;

const CARD = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "featured": coalesce(featured, false),
  "readingTime": round(length(pt::text(body)) / 5 / 200) + 1,
  "coverImage": coverImage{ asset, alt, caption, "aspectRatio": asset->metadata.dimensions.aspectRatio },
  "author": author->{ name, "slug": slug.current },
  "categories": categories[]->{ title, "slug": slug.current, description },
  "tags": tags[]->{ title, "slug": slug.current }
}`;

export const POST_LIST_QUERY = `*[${PUBLISHED}] | order(publishedAt desc) ${CARD}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "updatedAt": _updatedAt,
  "featured": coalesce(featured, false),
  "coverImage": coverImage{ asset, alt, caption, "aspectRatio": asset->metadata.dimensions.aspectRatio },
  "body": body[]{
    ...,
    markDefs[]{ ..., _type == "internalLink" => { "slug": @.reference->slug.current } }
  },
  faqs,
  "author": author->{ name, "slug": slug.current, role, bio, "avatar": avatar{ asset, alt } },
  "categories": categories[]->{ title, "slug": slug.current, description },
  "tags": tags[]->{ title, "slug": slug.current },
  "seo": seo{ metaTitle, metaDescription, canonicalUrl, noIndex, "ogImage": ogImage{ asset, alt } },
  "relatedManual": relatedManual[]->${CARD}
}`;
