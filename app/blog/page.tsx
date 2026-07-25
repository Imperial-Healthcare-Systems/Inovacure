import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import FeaturedArticle from "@/components/blog/FeaturedArticle";
import BlogDiscovery from "@/components/blog/BlogDiscovery";
import {
  getAllCategories,
  getFeaturedPost,
  getPostList,
} from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog — Inovacure Pharmaceuticals",
  description:
    "Insights on medicines, wellness, quality and the pharmaceutical industry from the Inovacure team.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const [featured, posts, categories] = await Promise.all([
    getFeaturedPost(),
    getPostList(),
    getAllCategories(),
  ]);

  // Avoid showing the featured post twice.
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : posts;

  return (
    <>
      <SiteHeader active="blog" />

      <header className="hc-pagehead">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <span className="hc-kick">Inovacure Blog</span>
            <h1>Insights for healthier lives.</h1>
            <p className="hc-lead">
              Evidence-led perspectives on medicines, wellness, quality and the
              business of pharmaceuticals — from the people who build them.
            </p>
          </div>
        </div>
      </header>

      {featured && (
        <section className="hc-block">
          <div className="wrap">
            <FeaturedArticle post={featured} />
          </div>
        </section>
      )}

      {posts.length > 0 ? (
        <BlogDiscovery posts={rest} categories={categories} />
      ) : (
        <section className="hc-block">
          <div className="wrap">
            <p className="hc-empty">
              Our first articles are on the way.{" "}
              <a href="/contact#enquiry">Tell us what you&rsquo;d like to read</a>.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
