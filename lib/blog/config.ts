// Shared blog constants. SITE_URL matches the root layout's metadataBase.
export const SITE_URL = "https://www.inovacure.in";
export const BLOG_BASE = "/blog";
export const ORG_NAME = "Inovacure Pharmaceuticals LLP";
export const ORG_LOGO = `${SITE_URL}/assets/logo-horizontal.png`;

export const postUrl = (slug: string) => `${SITE_URL}${BLOG_BASE}/${slug}`;
export const categoryUrl = (slug: string) =>
  `${SITE_URL}${BLOG_BASE}/category/${slug}`;
export const tagUrl = (slug: string) => `${SITE_URL}${BLOG_BASE}/tag/${slug}`;
