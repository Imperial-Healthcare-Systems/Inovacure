"use client";

import { useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import type { PostCard, TaxonomyRef } from "@/lib/blog/types";

// Client-side topic filter + text search over the already-loaded cards — mirrors
// the catalog's CatalogBrowser (chips + search). Fine at launch scale; a
// GROQ-backed search can replace the `.includes` when content volume grows.
// Cards render with reveal disabled (always visible) since they re-render on
// filter and the once-at-mount reveal runtime would not re-scan them.
export default function BlogDiscovery({
  posts,
  categories,
}: {
  posts: PostCard[];
  categories: TaxonomyRef[];
}) {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const shown = useMemo(
    () =>
      posts.filter((p) => {
        if (cat && !p.categories.some((c) => c.slug === cat)) return false;
        if (!q) return true;
        const hay = `${p.title} ${p.excerpt} ${p.categories
          .map((c) => c.title)
          .join(" ")} ${p.tags.map((t) => t.title).join(" ")}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }),
    [posts, cat, q],
  );

  return (
    <>
      <div className="hc-toolbar hc-blogtoolbar">
        <div className="wrap">
          <div className="hc-fgroup">
            <span className="hc-flbl">Topic</span>
            <button
              className={`hc-chip${cat === null ? " on" : ""}`}
              onClick={() => setCat(null)}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                className={`hc-chip${cat === c.slug ? " on" : ""}`}
                onClick={() => setCat(cat === c.slug ? null : c.slug)}
              >
                {c.title}
              </button>
            ))}
          </div>
          <label className="hc-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search articles…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search articles"
            />
          </label>
        </div>
      </div>

      <section className="hc-block">
        <div className="wrap">
          <p className="hc-count">
            <b>
              {shown.length} article{shown.length === 1 ? "" : "s"}
            </b>
          </p>
          {shown.length ? (
            <div className="hc-artgrid">
              {shown.map((p) => (
                <ArticleCard key={p._id} post={p} reveal={false} />
              ))}
            </div>
          ) : (
            <p className="hc-empty">
              Nothing matches that yet.{" "}
              <a href="/contact#enquiry">Suggest a topic</a>.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
