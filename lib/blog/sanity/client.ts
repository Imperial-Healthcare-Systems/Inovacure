import { createClient, type SanityClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  readToken,
} from "./env";

// Lazily built read client — importing never throws before creds exist. Reads
// are tag-labelled; the /api/revalidate webhook invalidates via revalidatePath.
let client: SanityClient | undefined;

function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  client ??= createClient({
    projectId,
    dataset,
    apiVersion,
    // CDN for anon public reads; API when a token is present (private dataset).
    useCdn: !readToken,
    token: readToken || undefined,
    perspective: "published",
    stega: false,
  });
  return client;
}

/** Single choke point for Sanity reads. Returns `fallback` when unconfigured. */
export async function sanityFetch<T>(opts: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  fallback: T;
}): Promise<T> {
  const c = getClient();
  if (!c) return opts.fallback;
  try {
    return await c.fetch<T>(opts.query, opts.params ?? {}, {
      next: { tags: opts.tags },
    });
  } catch {
    // Never let a Sanity outage break the (Markdown-backed) blog.
    return opts.fallback;
  }
}
