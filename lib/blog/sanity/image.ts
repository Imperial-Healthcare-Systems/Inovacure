import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { BlogImage } from "../types";

// Sanity image → a plain CDN URL string, so Sanity covers slot into Nischay's
// BlogImage model ({ src, alt, ... }) exactly like local /public images. The
// site's next.config allows cdn.sanity.io so next/image can optimise them.

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

type SanityImageSource = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
  aspectRatio?: number;
} | null | undefined;

/** Map a projected Sanity image to a BlogImage. Empty src if unresolvable. */
export function toBlogImage(
  source: SanityImageSource,
  fallbackAlt = "",
): BlogImage {
  if (!builder || !source?.asset?._ref) {
    return { src: "", alt: source?.alt ?? fallbackAlt };
  }
  const src = builder
    .image(source as { asset: { _ref: string } })
    .width(1600)
    .auto("format")
    .fit("max")
    .url();
  return {
    src,
    alt: source.alt ?? fallbackAlt,
    caption: source.caption,
    aspectRatio: source.aspectRatio,
  };
}

/** A sized CDN URL for inline body images (plain <img> in bodyHtml). */
export function inlineImageUrl(
  source: SanityImageSource,
  width = 1200,
): string {
  if (!builder || !source?.asset?._ref) return "";
  return builder
    .image(source as { asset: { _ref: string } })
    .width(width)
    .auto("format")
    .fit("max")
    .url();
}
