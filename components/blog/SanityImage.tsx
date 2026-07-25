import Image from "next/image";
import { baseImageSrc, blurProps, makeSanityLoader } from "@/lib/blog/image";
import type { CoverImage, SanityImageRef } from "@/lib/blog/types";

// next/image wrapper for Sanity assets. A per-image loader routes every srcset
// width through the CDN transform (honouring hotspot/crop); the LQIP metadata
// gives a blur-up placeholder so covers never cause layout shift. Renders
// nothing until Sanity is configured (baseImageSrc returns "").
export default function SanityImage({
  image,
  sizes = "100vw",
  priority = false,
  className,
  ratio,
}: {
  image: SanityImageRef | CoverImage;
  sizes?: string;
  priority?: boolean;
  className?: string;
  ratio?: number;
}) {
  const src = baseImageSrc(image);
  if (!src) return null;

  const cover = image as CoverImage;
  const aspect = ratio ?? cover.aspectRatio ?? 16 / 9;

  return (
    <span
      className={className}
      style={{ position: "relative", display: "block", aspectRatio: String(aspect) }}
    >
      <Image
        loader={makeSanityLoader(image)}
        src={src}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
        {...blurProps(cover.lqip)}
      />
    </span>
  );
}
