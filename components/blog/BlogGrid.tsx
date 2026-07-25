import ArticleCard from "./ArticleCard";
import type { PostCard } from "@/lib/blog/types";

// Responsive card grid. Empty state matches the catalog's honest voice.
export default function BlogGrid({
  posts,
  emptyLabel = "No articles here yet — check back soon.",
}: {
  posts: PostCard[];
  emptyLabel?: string;
}) {
  if (!posts.length) {
    return (
      <p className="hc-empty">
        {emptyLabel}{" "}
        <a href="/contact#enquiry">Ask us what&rsquo;s coming</a>.
      </p>
    );
  }
  return (
    <div className="hc-artgrid">
      {posts.map((p) => (
        <ArticleCard key={p._id} post={p} />
      ))}
    </div>
  );
}
