import SanityImage from "./SanityImage";
import type { AuthorFullModel } from "@/lib/blog/types";

// Author byline card shown after the article body. Net-new, built on tokens.
export default function AuthorCard({ author }: { author: AuthorFullModel }) {
  return (
    <aside className="hc-authorcard" data-reveal>
      {author.avatar?.asset && (
        <span className="hc-authorcard-avatar">
          <SanityImage image={author.avatar} ratio={1} sizes="80px" />
        </span>
      )}
      <div className="hc-authorcard-text">
        <span className="hc-authorcard-kick">Written by</span>
        <b>{author.name}</b>
        {author.role && <span className="hc-authorcard-role">{author.role}</span>}
        {author.bio && <p>{author.bio}</p>}
      </div>
    </aside>
  );
}
