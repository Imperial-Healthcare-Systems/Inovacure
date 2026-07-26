import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// DEV-ONLY blog write endpoint for the admin composer (Approach B).
//
// It writes a composed post straight into content/blog/*.md on the author's
// machine. It is HARD-GATED to development: in a production build every method
// returns 404, so it adds no write surface to the deployed site (verified by
// building and cur/ing it in production). It is NOT protected by the engine's
// client-side admin password — that credential is public at /engine.js and must
// be treated as known — so this must never be enabled in production. Real
// publishing to the live site remains a git commit + redeploy.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEV = process.env.NODE_ENV === "development";
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function notFound() {
  return new NextResponse("Not found", { status: 404 });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Every taxonomy item must be a quoted string (or an object with a string
 *  title). A bare numeric/boolean YAML scalar throws in toTaxonomy at build. */
function taxonomyOk(list: unknown): boolean {
  if (!Array.isArray(list)) return false;
  return list.every(
    (x) =>
      typeof x === "string" ||
      (x !== null && typeof x === "object" && typeof (x as { title?: unknown }).title === "string"),
  );
}

/** Authoritative re-validation of the parsed frontmatter + body. Mirrors the
 *  editor's client-side guards so a hand-crafted payload cannot slip a
 *  build-breaking file onto disk. */
function validate(data: Record<string, unknown>, content: string): string[] {
  const e: string[] = [];

  if (!isNonEmptyString(data.title)) e.push("title is required");
  if (!isNonEmptyString(data.excerpt)) e.push("excerpt is required");

  // publishedAt must be a STRING. Unquoted YAML dates parse to Date objects,
  // which corrupt the <time datetime> attribute downstream.
  if (!isNonEmptyString(data.publishedAt))
    e.push("publishedAt must be a non-empty quoted string (e.g. \"2026-08-01\")");
  if (data.updatedAt != null && typeof data.updatedAt !== "string")
    e.push("updatedAt must be a quoted string");

  const cover = data.coverImage;
  const coverSrc =
    typeof cover === "string" ? cover : (cover as { src?: unknown } | undefined)?.src;
  if (!isNonEmptyString(coverSrc)) e.push("coverImage.src is required");

  if (!Array.isArray(data.categories) || data.categories.length < 1)
    e.push("at least one category is required");
  else if (!taxonomyOk(data.categories))
    e.push("every category must be a quoted string");

  if (data.tags != null && !taxonomyOk(data.tags))
    e.push("every tag must be a quoted string");

  // Raw HTML <table> breaks render.ts's wrapper pass (orphan </div>).
  if (/<table[\s>]/i.test(content) || /<\/table>/i.test(content))
    e.push("remove raw HTML <table> from the body — use a Markdown table");

  return e;
}

export async function GET() {
  if (!DEV) return notFound();
  const slugs = fs.existsSync(BLOG_DIR)
    ? fs
        .readdirSync(BLOG_DIR)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => f.replace(/\.mdx?$/, ""))
    : [];
  return NextResponse.json({ slugs });
}

export async function POST(req: Request) {
  if (!DEV) return notFound();

  let payload: { slug?: unknown; markdown?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, markdown } = payload;
  if (typeof slug !== "string" || !SLUG_RE.test(slug))
    return NextResponse.json({ ok: false, error: "Invalid slug" }, { status: 400 });
  if (!isNonEmptyString(markdown))
    return NextResponse.json({ ok: false, error: "Empty markdown" }, { status: 400 });

  let data: Record<string, unknown>;
  let content: string;
  try {
    const parsed = matter(markdown);
    data = parsed.data as Record<string, unknown>;
    content = parsed.content;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Frontmatter is not valid YAML" },
      { status: 400 },
    );
  }

  const errors = validate(data, content);
  if (errors.length)
    return NextResponse.json({ ok: false, error: errors.join("; ") }, { status: 400 });

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(file))
    return NextResponse.json(
      { ok: false, error: `A post named "${slug}" already exists` },
      { status: 409 },
    );

  fs.writeFileSync(file, markdown, "utf8");

  const published =
    typeof data.publishedAt === "string" &&
    data.publishedAt.trim().length > 0 &&
    new Date(data.publishedAt) <= new Date();

  return NextResponse.json({
    ok: true,
    slug,
    path: `content/blog/${slug}.md`,
    published,
  });
}
