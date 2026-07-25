import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog/config";
import { PRODUCTS } from "@/components/products/products";
import {
  getAllCategories,
  getAllTags,
  getPostList,
} from "@/lib/blog/posts";

// Whole-site sitemap (net-new — the site had none). Static pages + products +
// every published post/category/tag. Drafts are excluded because getPostList
// only returns published posts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/business",
    "/business/ethical-promotion",
    "/business/nutraceuticals",
    "/business/apis",
    "/business/pharma-exports",
    "/products",
    "/quality",
    "/partners",
    "/contact",
    "/blog",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: p === "/blog" ? "daily" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const [posts, categories, tags] = await Promise.all([
    getPostList(),
    getAllCategories(),
    getAllTags(),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const taxonomyEntries: MetadataRoute.Sitemap = [
    ...categories.map((c) => ({
      url: `${SITE_URL}/blog/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((t) => ({
      url: `${SITE_URL}/blog/tag/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  return [
    ...staticEntries,
    ...productEntries,
    ...postEntries,
    ...taxonomyEntries,
  ];
}
