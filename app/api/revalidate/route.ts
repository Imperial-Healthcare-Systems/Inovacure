import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { revalidateSecret } from "@/sanity/env";

// Sanity publish webhook → on-demand revalidation. Configure a webhook in
// Sanity (API → Webhooks) pointing at POST /api/revalidate?secret=... with a
// projection body of at least: { "_type": _type, "slug": slug.current }.
//
// `revalidatePath('/blog', 'layout')` invalidates the entire /blog subtree
// (index, article, category, tag pages) in one call; the feed and sitemap are
// refreshed alongside. Data fetches are also tag-labelled (see lib/blog/client)
// for future tag-based invalidation.

export async function POST(req: NextRequest) {
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-webhook-secret");

  if (!revalidateSecret || provided !== revalidateSecret) {
    return NextResponse.json(
      { ok: false, message: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  let body: { _type?: string; slug?: string | { current?: string } } = {};
  try {
    body = await req.json();
  } catch {
    // A body is optional — fall back to a broad subtree refresh.
  }

  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;

  // Whole blog subtree + discovery-surface routes.
  revalidatePath("/blog", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");

  return NextResponse.json({
    ok: true,
    revalidated: true,
    slug: slug ?? null,
    type: body._type ?? null,
  });
}
