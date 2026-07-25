"use client";

import { useEffect, useState } from "react";

// Reading-progress bar for the article. rAF-throttled scroll math against the
// article body element. There is no equivalent in the React app (the legacy
// storefront's #scrollProg belongs to a separate DOM), so this is net-new.
export default function ReadingProgress({
  targetId = "article-body",
}: {
  targetId?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div className="hc-readprog" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
