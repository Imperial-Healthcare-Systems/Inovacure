import type { MetadataRoute } from "next";

// Minimal web manifest (net-new, low priority). Square PWA icons (192/512) can
// be added under public/ and referenced here when available.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inovacure Pharmaceuticals",
    short_name: "Inovacure",
    description:
      "High-quality, affordable medicines across ethical formulations, nutraceuticals, APIs and exports.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#004497",
    lang: "en-IN",
  };
}
