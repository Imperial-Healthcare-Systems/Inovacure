import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog/posts";

// Dynamic, branded OG card per article (text-based → no remote image fetch, so
// it renders even before assets exist). Uses the brand palette from tokens.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Inovacure article";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Inovacure Blog";
  const category = post?.categories?.[0]?.title ?? "Inovacure";
  const author = post?.author?.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #003a82 0%, #004497 60%, #0a5bbf 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
            Inovacure
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: "#8ec77a",
              fontWeight: 700,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 80 ? 56 : 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#cfe0f5" }}>
            {author ? `By ${author}` : "Live Healthy."}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#cfe0f5" }}>
            inovacure.in
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
