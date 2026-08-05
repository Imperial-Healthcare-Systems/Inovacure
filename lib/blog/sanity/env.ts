// Sanity connection env for the SITE's read layer (the Studio is deployed
// separately). Never throws at import — `isSanityConfigured` lets the blog fall
// back to Markdown-only when creds are absent.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const readToken = process.env.SANITY_API_READ_TOKEN || "";
export const isSanityConfigured = projectId.length > 0;
