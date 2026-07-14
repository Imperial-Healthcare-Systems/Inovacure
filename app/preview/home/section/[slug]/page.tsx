import { notFound } from "next/navigation";
import { HOME_SECTIONS } from "@/components/home/sections";

// Standalone per-beat preview for human review + screenshots.
export default async function SectionPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = HOME_SECTIONS.find((s) => s.slug === slug);
  if (!section) notFound();
  const { Component } = section;
  return <Component />;
}
