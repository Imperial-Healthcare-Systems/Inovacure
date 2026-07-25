// Shared, locale-stable formatting (en-IN, matching the site's locale).

export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function readingLabel(minutes: number | undefined): string {
  const m = Math.max(1, Math.round(minutes ?? 1));
  return `${m} min read`;
}
