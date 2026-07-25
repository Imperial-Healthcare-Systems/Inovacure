import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import BlogGrid from "@/components/blog/BlogGrid";
import { tagUrl } from "@/lib/blog/config";
import { getAllTags, getPostsByTag, getTag } from "@/lib/blog/posts";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return {};
  return {
    title: `#${tag.title} — Inovacure Blog`,
    description: `Articles tagged ${tag.title} from the Inovacure blog.`,
    alternates: { canonical: tagUrl(slug) },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tag, posts] = await Promise.all([getTag(slug), getPostsByTag(slug)]);
  if (!tag) notFound();

  return (
    <>
      <SiteHeader active="blog" />

      <header className="hc-pagehead">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: `#${tag.title}` },
              ]}
            />
            <span className="hc-kick">Tag</span>
            <h1>#{tag.title}</h1>
          </div>
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap">
          <BlogGrid posts={posts} emptyLabel={`No articles tagged ${tag.title} yet.`} />
        </div>
      </section>

      <Footer />
    </>
  );
}
