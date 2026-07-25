import type { TaxonomyRef } from "@/lib/blog/types";

// CategoryBadge reuses the catalog's `.hc-pbadge` (halo bg, success text).
export function CategoryBadge({ category }: { category: TaxonomyRef }) {
  return (
    <a className="hc-pbadge hc-catbadge" href={`/blog/category/${category.slug}`}>
      {category.title}
    </a>
  );
}

// TagBadge is a compact pill (net-new `.hc-tagpill`, on-brand).
export function TagBadge({ tag }: { tag: TaxonomyRef }) {
  return (
    <a className="hc-tagpill" href={`/blog/tag/${tag.slug}`}>
      #{tag.title}
    </a>
  );
}

export function TagList({ tags }: { tags: TaxonomyRef[] }) {
  if (!tags?.length) return null;
  return (
    <div className="hc-taglist">
      {tags.map((t) => (
        <TagBadge key={t.slug} tag={t} />
      ))}
    </div>
  );
}
