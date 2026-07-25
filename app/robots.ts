import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog/config";

// Net-new (the site had none). Public content is crawlable; internal/tooling
// surfaces (Studio, preview harness, dormant store, API) are disallowed. Note
// robots rules are advisory — the Studio is also env-gated + noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/preview", "/store", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
