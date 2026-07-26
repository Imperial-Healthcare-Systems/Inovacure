import Image from "next/image";
import type { BlogImage as BlogImageModel } from "@/lib/blog/types";

// next/image wrapper for local blog art. Images live under /public (referenced
// by path in Markdown frontmatter, e.g. "/blog/cover.webp"), so next/image
// optimises them directly — no CDN loader. A fixed aspect-ratio well prevents
// layout shift. Renders nothing when no source is set.
export default function BlogImage({
  image,
  sizes = "100vw",
  priority = false,
  className,
  ratio,
}: {
  image: BlogImageModel;
  sizes?: string;
  priority?: boolean;
  className?: string;
  ratio?: number;
}) {
  if (!image?.src) return null;

  const aspect = ratio ?? image.aspectRatio ?? 16 / 9;

  return (
    <span
      className={className}
      style={{ position: "relative", display: "block", aspectRatio: String(aspect) }}
    >
      <Image
        src={image.src}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </span>
  );
}
