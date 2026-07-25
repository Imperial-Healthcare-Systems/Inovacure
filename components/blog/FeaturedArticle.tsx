import SanityImage from "./SanityImage";
import { formatDate, readingLabel } from "@/lib/blog/format";
import type { PostCard } from "@/lib/blog/types";

// The featured post that headlines the blog index — a wide split card
// (image + text) echoing the site's `.hc-bizcard`/editorial-band language.
export default function FeaturedArticle({ post }: { post: PostCard }) {
  const category = post.categories?.[0];
  return (
    <article className="hc-feature" data-reveal>
      <a href={`/blog/${post.slug}`} className="hc-feature-media">
        <SanityImage
          image={post.coverImage}
          ratio={16 / 10}
          sizes="(max-width: 900px) 100vw, 620px"
          priority
        />
      </a>
      <div className="hc-feature-body">
        <span className="hc-kick">
          {category ? category.title : "Featured"} · Featured
        </span>
        <h2>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h2>
        <p className="hc-lead hc-feature-lead">{post.excerpt}</p>
        <div className="hc-feature-meta">
          <span>{post.author?.name}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{readingLabel(post.readingTime)}</span>
        </div>
        <a className="btn btn-primary" href={`/blog/${post.slug}`}>
          Read article
        </a>
      </div>
    </article>
  );
}
