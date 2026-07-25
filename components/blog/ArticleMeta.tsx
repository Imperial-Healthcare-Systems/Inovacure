import { formatDate, readingLabel } from "@/lib/blog/format";
import type { Post } from "@/lib/blog/types";

// Byline row under the article title: author · published (· updated) · reading.
export default function ArticleMeta({ post }: { post: Post }) {
  const updated =
    post.updatedAt &&
    new Date(post.updatedAt).toDateString() !==
      new Date(post.publishedAt).toDateString();

  return (
    <div className="hc-artmeta">
      <span className="hc-artmeta-author">{post.author.name}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      {updated && (
        <>
          <span aria-hidden="true">·</span>
          <span className="hc-artmeta-upd">Updated {formatDate(post.updatedAt)}</span>
        </>
      )}
      <span aria-hidden="true">·</span>
      <span>{readingLabel(post.readingTime)}</span>
    </div>
  );
}
