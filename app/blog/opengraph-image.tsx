import { ImageResponse } from "next/og";

// Default branded OG card for the blog index.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Inovacure Blog";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          padding: "80px",
          background: "linear-gradient(135deg, #003a82 0%, #004497 60%, #0a5bbf 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#8ec77a", letterSpacing: 3, textTransform: "uppercase" }}>
          Inovacure Blog
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 960 }}>
          Insights for healthier lives.
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#cfe0f5" }}>
          Medicines · Wellness · Quality · inovacure.in
        </div>
      </div>
    ),
    { ...size },
  );
}
