import ArticleCard from "./ArticleCard";
import type { PostCard } from "@/lib/blog/types";

// Related reading rail below the article.
export default function RelatedArticles({ posts }: { posts: PostCard[] }) {
  if (!posts.length) return null;
  return (
    <section className="hc-block hc-related">
      <div className="wrap">
        <h2 data-reveal="mask">Related reading</h2>
        <div className="hc-artgrid hc-artgrid-3">
          {posts.map((p) => (
            <ArticleCard key={p._id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
