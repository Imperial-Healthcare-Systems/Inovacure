"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/blog/types";

// Sticky table of contents. Scroll-to routes through Lenis (window.__lenis,
// published by SiteRuntime) so it doesn't fight the smooth-scroll loop; when
// Lenis is absent (reduced motion / no-JS-yet) it falls back to native
// scrollIntoView. Active heading tracked via IntersectionObserver on the
// server-rendered headings.
export default function TableOfContents({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const onJump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(el, { offset: -96 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav className="hc-toc" aria-label="On this page">
      <p className="hc-toc-title">On this page</p>
      <ul>
        {items.map((it) => (
          <li
            key={it.id}
            className={`hc-toc-item l${it.level}${active === it.id ? " is-active" : ""}`}
          >
            <a href={`#${it.id}`} onClick={(e) => onJump(e, it.id)}>
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
