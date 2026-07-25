// Provider-agnostic analytics seam. No analytics vendor is wired into the site
// yet, so this is intentionally a no-op — it exists so blog events are
// instrumentable the day a provider (GA, Plausible, etc.) is chosen, without
// touching component code. Swap the body for the provider's call then.

export type BlogEvent =
  | "article_view"
  | "share_click"
  | "cta_click"
  | "related_click";

export function track(event: BlogEvent, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    // Surfaces intent during development; silent in production until wired.
    // eslint-disable-next-line no-console
    console.debug("[blog:track]", event, payload ?? {});
  }
}
