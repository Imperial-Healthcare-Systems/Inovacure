import { Marked } from "marked";
import GithubSlugger from "github-slugger";
import type { TocEntry } from "./types";

// Markdown → HTML for article bodies. Every post is rendered once (at build /
// request time) into a controlled HTML string that `.hc-prose` styles, plus the
// h2/h3 table of contents. Heading ids come from the SAME slugger pass that
// builds the TOC, so anchor links always match — including numeric suffixes on
// repeated headings (github-slugger handles that).

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function renderMarkdown(markdown: string): {
  html: string;
  toc: TocEntry[];
  readingTime: number;
} {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      // `text` is already-parsed inline HTML; `raw` is the source text.
      heading(text: string, level: number, raw: string) {
        if (level === 2 || level === 3) {
          const id = slugger.slug(raw);
          toc.push({ id, text: stripTags(text), level });
          return `<h${level} id="${id}"><a class="hc-h-anchor" href="#${id}" aria-label="Link to this section">#</a>${text}</h${level}>\n`;
        }
        return `<h${level}>${text}</h${level}>\n`;
      },
      // Lazy-load inline images; the cover uses next/image via <BlogImage>.
      image(href: string, title: string | null | undefined, alt: string) {
        const t = title ? ` title="${title}"` : "";
        return `<img src="${href}" alt="${alt ?? ""}"${t} loading="lazy" decoding="async" />`;
      },
      // Open external links safely; internal /blog links stay in-tab.
      link(href: string, title: string | null | undefined, text: string) {
        const external = /^https?:\/\//i.test(href);
        const t = title ? ` title="${title}"` : "";
        const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${href}"${t}${rel}>${text}</a>`;
      },
    },
  });

  let html = marked.parse(markdown, { async: false }) as string;
  // Match the prose stylesheet's scroll wrapper (`.hc-prose-tablewrap > table`).
  html = html
    .replace(/<table>/g, '<div class="hc-prose-tablewrap"><table>')
    .replace(/<\/table>/g, "</table></div>");

  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return { html, toc, readingTime };
}
