import type { PortableTextBlock } from "@portabletext/react";
import type { TocEntry } from "./types";

// Heading ids are computed ONCE here and shared by both the TOC and the body
// renderer (via idByKey), so anchor links always match — including the numeric
// suffix that disambiguates repeated headings.

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type Blockish = {
  _type?: string;
  _key?: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

export function blockPlainText(block: PortableTextBlock): string {
  const b = block as Blockish;
  if (!Array.isArray(b.children)) return "";
  return b.children.map((c) => c.text ?? "").join("");
}

/**
 * Scans the body once and returns the ordered TOC (h2/h3 only) plus a
 * _key → id lookup the renderer uses to stamp matching heading anchors.
 */
export function buildHeadingIndex(blocks: PortableTextBlock[] | undefined): {
  toc: TocEntry[];
  idByKey: Record<string, string>;
} {
  const toc: TocEntry[] = [];
  const idByKey: Record<string, string> = {};
  const seen = new Map<string, number>();

  for (const block of blocks ?? []) {
    const b = block as Blockish;
    if (b._type !== "block" || (b.style !== "h2" && b.style !== "h3")) continue;
    const text = blockPlainText(block);
    if (!text) continue;

    let id = slugify(text) || "section";
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    if (n > 0) id = `${id}-${n}`;

    if (b._key) idByKey[b._key] = id;
    toc.push({ id, text, level: b.style === "h2" ? 2 : 3 });
  }

  return { toc, idByKey };
}

/** Rough word count of a portable-text body (used by OG / fallbacks). */
export function portableTextWordCount(blocks: PortableTextBlock[] | undefined): number {
  let words = 0;
  for (const block of blocks ?? []) {
    if ((block as Blockish)._type !== "block") continue;
    const text = blockPlainText(block).trim();
    if (text) words += text.split(/\s+/).length;
  }
  return words;
}
