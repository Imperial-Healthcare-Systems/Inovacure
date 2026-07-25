import SanityImage from "./SanityImage";
import { CategoryBadge } from "./Badges";
import { formatDate, readingLabel } from "@/lib/blog/format";
import type { PostCard } from "@/lib/blog/types";

// Article card — mirrors the catalog `.hc-pcard` look (lift-on-hover, top media
// well, body) but is purpose-built to contain a next/image cover. `data-reveal`
// hooks the shared scroll-in animation.
export default function ArticleCard({
  post,
  reveal = true,
  sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px",
}: {
  post: PostCard;
  reveal?: boolean;
  sizes?: string;
}) {
  const category = post.categories?.[0];
  return (
    <article className="hc-artcard" {...(reveal ? { "data-reveal": true } : {})}>
      <a href={`/blog/${post.slug}`} className="hc-artcard-link">
        <span className="hc-artcard-media">
          <SanityImage image={post.coverImage} ratio={16 / 10} sizes={sizes} />
          {category && <span className="hc-pbadge hc-catbadge-static">{category.title}</span>}
        </span>
        <span className="hc-artcard-body">
          <span className="hc-pseg">
            {category ? `${category.title} · ` : ""}
            {readingLabel(post.readingTime)}
          </span>
          <h3>{post.title}</h3>
          <p className="hc-pmeta">{post.excerpt}</p>
          <span className="hc-artcard-foot">
            <span className="hc-ppack">{formatDate(post.publishedAt)}</span>
            <span className="hc-penq">Read →</span>
          </span>
        </span>
      </a>
    </article>
  );
}
