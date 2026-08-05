import { toHTML, type PortableTextHtmlComponents } from "@portabletext/to-html";
import GithubSlugger from "github-slugger";
import type { PortableTextBlock } from "@portabletext/types";
import type { TocEntry } from "../types";
import { inlineImageUrl } from "./image";

// Portable Text → the SAME controlled HTML string Nischay's Markdown renderer
// produces (matching `.hc-prose` markup, `.hc-h-anchor` headings, github-slugger
// ids, `.hc-prose-tablewrap` tables), so a Sanity post is indistinguishable from
// a Markdown post downstream. Heading ids share one slugger pass with the TOC.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function wordCount(blocks: PortableTextBlock[]): number {
  let text = "";
  for (const b of blocks) {
    const block = b as { _type?: string; children?: { text?: string }[] };
    if (block._type === "block" && Array.isArray(block.children)) {
      text += " " + block.children.map((c) => c.text ?? "").join(" ");
    }
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function renderPortableText(blocks: PortableTextBlock[] | undefined): {
  html: string;
  toc: TocEntry[];
  readingTime: number;
} {
  if (!blocks?.length) return { html: "", toc: [], readingTime: 1 };

  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  const heading = (level: 2 | 3, children: string) => {
    const id = slugger.slug(stripTags(children));
    toc.push({ id, text: stripTags(children), level });
    return `<h${level} id="${id}"><a class="hc-h-anchor" href="#${id}" aria-label="Link to this section">#</a>${children}</h${level}>`;
  };

  const components: Partial<PortableTextHtmlComponents> = {
    block: {
      normal: ({ children }) => `<p>${children}</p>`,
      blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
      h2: ({ children }) => heading(2, children as string),
      h3: ({ children }) => heading(3, children as string),
      h4: ({ children }) => `<h4>${children}</h4>`,
    },
    list: {
      bullet: ({ children }) => `<ul>${children}</ul>`,
      number: ({ children }) => `<ol>${children}</ol>`,
    },
    listItem: {
      bullet: ({ children }) => `<li>${children}</li>`,
      number: ({ children }) => `<li>${children}</li>`,
    },
    marks: {
      strong: ({ children }) => `<strong>${children}</strong>`,
      em: ({ children }) => `<em>${children}</em>`,
      code: ({ children }) => `<code>${children}</code>`,
      link: ({ children, value }) => {
        const href = (value as { href?: string })?.href ?? "#";
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${children}</a>`;
      },
      internalLink: ({ children, value }) => {
        const slug = (value as { slug?: string })?.slug;
        return slug
          ? `<a href="/blog/${escapeHtml(slug)}">${children}</a>`
          : `${children}`;
      },
    },
    types: {
      figure: ({ value }) => {
        const v = value as { alt?: string; caption?: string };
        const url = inlineImageUrl(value as never);
        if (!url) return "";
        const cap = v.caption
          ? `<figcaption>${escapeHtml(v.caption)}</figcaption>`
          : "";
        return `<figure class="hc-figure"><img src="${url}" alt="${escapeHtml(v.alt ?? "")}" loading="lazy" decoding="async" />${cap}</figure>`;
      },
      callout: ({ value }) => {
        const v = value as { tone?: string; title?: string; body?: string };
        const title = v.title ? `<b>${escapeHtml(v.title)}</b>` : "";
        return `<div class="hc-callout is-${v.tone ?? "info"}">${title}<p>${escapeHtml(v.body ?? "")}</p></div>`;
      },
      codeBlock: ({ value }) => {
        const v = value as { language?: string; filename?: string; code?: string };
        const name = v.filename
          ? `<figcaption class="hc-code-name">${escapeHtml(v.filename)}</figcaption>`
          : "";
        return `<figure class="hc-code">${name}<pre data-language="${escapeHtml(v.language ?? "text")}"><code>${escapeHtml(v.code ?? "")}</code></pre></figure>`;
      },
      contentTable: ({ value }) => {
        const v = value as { hasHeader?: boolean; rows?: { cells?: string[] }[] };
        const rows = v.rows ?? [];
        if (!rows.length) return "";
        const [head, ...rest] = v.hasHeader ? rows : [null, ...rows];
        const thead = head
          ? `<thead><tr>${(head.cells ?? []).map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>`
          : "";
        const tbody = `<tbody>${rest
          .map(
            (r) =>
              `<tr>${(r?.cells ?? []).map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody>`;
        return `<div class="hc-prose-tablewrap"><table>${thead}${tbody}</table></div>`;
      },
      faq: ({ value }) => {
        const v = value as { items?: { question: string; answer: string }[] };
        const items = v.items ?? [];
        if (!items.length) return "";
        const details = items
          .map(
            (f) =>
              `<details class="hc-faqitem" name="hc-prose-faq"><summary>${escapeHtml(f.question)}<span class="hc-faqmark" aria-hidden="true">+</span></summary><p>${escapeHtml(f.answer)}</p></details>`,
          )
          .join("");
        return `<div class="hc-faqlist hc-prose-faq">${details}</div>`;
      },
    },
  };

  const html = toHTML(blocks, { components });
  return { html, toc, readingTime: Math.max(1, Math.round(wordCount(blocks) / 200)) };
}
