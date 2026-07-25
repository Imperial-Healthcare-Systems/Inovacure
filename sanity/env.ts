// Central Sanity env access. Deliberately does NOT throw at import time so the
// site keeps building before the client supplies credentials — callers use
// `isSanityConfigured` to degrade gracefully (empty lists / null) until then.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** Server-only read token — enables draft/preview perspective. Never exposed. */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

/** Shared secret the Sanity publish webhook signs revalidation requests with. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || "";

/** True once a real project id is present — gates all live data access. */
export const isSanityConfigured = projectId.length > 0;
