import { createClient, type SanityClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  readToken,
} from "@/sanity/env";

// Lazily constructed so importing this module never throws before the client
// supplies credentials (createClient requires a projectId). Until configured,
// every fetch returns its fallback and the blog renders empty states.

let publishedClient: SanityClient | undefined;
let previewClient: SanityClient | undefined;

function getClient(preview: boolean): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (preview) {
    previewClient ??= createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: readToken,
      perspective: "drafts", // draft overlaid on published for preview
      stega: false,
    });
    return previewClient;
  }
  publishedClient ??= createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
    stega: false,
  });
  return publishedClient;
}

/** Cache-tag helpers — mirror the tags the revalidate webhook invalidates. */
export const tags = {
  all: "posts",
  post: (slug: string) => `post:${slug}`,
  category: (slug: string) => `category:${slug}`,
  tag: (slug: string) => `tag:${slug}`,
  taxonomy: "taxonomy",
};

/**
 * The single choke point for all Sanity reads. Published reads are tagged for
 * on-demand revalidation; preview reads bypass the cache (draftMode). Returns
 * `fallback` verbatim when Sanity is not yet configured.
 */
export async function sanityFetch<T>(opts: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  fallback: T;
  preview?: boolean;
}): Promise<T> {
  const client = getClient(opts.preview ?? false);
  if (!client) return opts.fallback;

  return client.fetch<T>(opts.query, opts.params ?? {}, {
    ...(opts.preview
      ? { cache: "no-store" }
      : { next: { tags: opts.tags } }),
  });
}
