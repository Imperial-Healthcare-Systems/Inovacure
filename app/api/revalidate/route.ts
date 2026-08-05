import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

// Sanity publish webhook → on-demand revalidation of the blog subtree, so posts
// published in the Sanity editor appear on the live site without a redeploy.
// (Markdown posts are git-committed and publish via redeploy.) Configure in
// Sanity → API → Webhooks: POST /api/revalidate?secret=$SANITY_REVALIDATE_SECRET
const secret = process.env.SANITY_REVALIDATE_SECRET || "";

export async function POST(req: NextRequest) {
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-webhook-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json(
      { ok: false, message: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  revalidatePath("/blog", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");

  return NextResponse.json({ ok: true, revalidated: true });
}
