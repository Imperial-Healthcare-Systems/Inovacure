import { getPostList } from "@/lib/blog/posts";
import { urlForImage } from "@/lib/blog/image";
import { BLOG_BASE, ORG_NAME, SITE_URL, postUrl } from "@/lib/blog/config";

// RSS 2.0 feed of the latest published posts.
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = (await getPostList()).slice(0, 30);
  const now = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const link = postUrl(p.slug);
      const img = urlForImage(p.coverImage)?.width(1200).url();
      const cats = [...p.categories, ...p.tags]
        .map((c) => `<category>${escapeXml(c.title)}</category>`)
        .join("");
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      ${p.author?.name ? `<dc:creator>${escapeXml(p.author.name)}</dc:creator>` : ""}
      ${img ? `<enclosure url="${img}" type="image/jpeg" />` : ""}
      ${cats}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(ORG_NAME)} — Blog</title>
    <link>${SITE_URL}${BLOG_BASE}</link>
    <description>Insights on medicines, wellness, quality and the pharmaceutical industry.</description>
    <language>en-in</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}${BLOG_BASE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
