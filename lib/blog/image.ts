import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { SanityImageRef } from "./types";

// @sanity/image-url needs projectId/dataset. Guarded so an unconfigured build
// doesn't throw; callers only render images once real content exists.
const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

// Infer the builder type rather than importing from an internal path.
type ImageUrlBuilder = ReturnType<NonNullable<typeof builder>["image"]>;

export function urlForImage(source: SanityImageRef): ImageUrlBuilder | null {
  if (!builder || !source?.asset) return null;
  return builder.image(source).auto("format").fit("max");
}

/**
 * A next/image loader bound to a specific Sanity image so responsive srcset
 * widths all route through the CDN transform — honouring the image's hotspot
 * and crop (raw query params would not). Pair with `src` = a small base URL.
 */
export function makeSanityLoader(source: SanityImageRef) {
  return ({ width, quality }: { width: number; quality?: number }) => {
    const b = urlForImage(source);
    if (!b) return "";
    return b.width(width).quality(quality ?? 78).url();
  };
}

/** A tiny base URL used as next/image's `src` when a custom loader is set. */
export function baseImageSrc(source: SanityImageRef): string {
  return urlForImage(source)?.width(24).url() ?? "";
}

/** LQIP blur placeholder if the projection resolved metadata.lqip. */
export function blurProps(lqip?: string) {
  return lqip ? ({ placeholder: "blur" as const, blurDataURL: lqip }) : {};
}
