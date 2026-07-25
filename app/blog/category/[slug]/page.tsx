import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import BlogGrid from "@/components/blog/BlogGrid";
import { categoryUrl } from "@/lib/blog/config";
import {
  getAllCategories,
  getCategory,
  getPostsByCategory,
} from "@/lib/blog/posts";

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.title} — Inovacure Blog`,
    description:
      cat.description || `Articles in ${cat.title} from the Inovacure blog.`,
    alternates: { canonical: categoryUrl(slug) },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategory(slug),
    getPostsByCategory(slug),
  ]);
  if (!category) notFound();

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
                { label: category.title },
              ]}
            />
            <span className="hc-kick">Category</span>
            <h1>{category.title}</h1>
            {category.description && (
              <p className="hc-lead">{category.description}</p>
            )}
          </div>
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap">
          <BlogGrid
            posts={posts}
            emptyLabel={`No articles in ${category.title} yet.`}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
