import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import StudioRoot from "./Studio.client";

// GATED + NON-DISCOVERABLE Studio (per the client's requirement that no visitor
// reaches it accidentally):
//   1. Route gate — 404 unless SANITY_STUDIO_ENABLED === "true" (mirrors the
//      COMMERCE_ENABLED pattern on /store). Enable it only where editors work.
//   2. noindex metadata + never linked from any nav/footer/sitemap.
//   3. Sanity's own login gates all editing regardless.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

// Studio wants the full viewport and no user zoom clamping.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (process.env.SANITY_STUDIO_ENABLED !== "true") notFound();
  return <StudioRoot />;
}
