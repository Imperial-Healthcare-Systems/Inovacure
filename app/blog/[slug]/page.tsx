import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import ArticleMeta from "@/components/blog/ArticleMeta";
import BlogImage from "@/components/blog/BlogImage";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { TagList } from "@/components/blog/Badges";

import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog/posts";
import { buildPostJsonLd, buildPostMetadata, isDraft } from "@/lib/blog/metadata";

// Static params from published slugs; new posts fall back to ISR (dynamicParams).
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();
  // Drafts (future-dated / unpublished) are not publicly visible.
  if (isDraft(post)) notFound();

  const toc = post.toc;
  const related = await getRelatedPosts(post, 3);
  const category = post.categories?.[0];
  const jsonLd = buildPostJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader active="blog" />
      <ReadingProgress targetId="article-body" />

      <header className="hc-pagehead hc-arthead">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          {category && <span className="hc-kick">{category.title}</span>}
          <h1>{post.title}</h1>
          <p className="hc-lead">{post.excerpt}</p>
        </div>
      </header>

      <section className="hc-block hc-article">
        <div className="wrap">
          <ArticleMeta post={post} />

          {post.coverImage?.src && (
            <figure className="hc-article-cover" data-reveal>
              <BlogImage
                image={post.coverImage}
                priority
                sizes="(max-width: 1320px) 100vw, 1320px"
              />
              {post.coverImage.caption && (
                <figcaption className="hc-article-cover-cap">
                  {post.coverImage.caption}
                </figcaption>
              )}
            </figure>
          )}

          <div className="hc-article-grid">
            <div className="hc-toc-wrap">
              <TableOfContents items={toc} />
            </div>

            <div className="hc-prose" id="article-body">
              <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

              {post.faqs && post.faqs.length > 0 && (
                <section className="hc-prose-faqsection">
                  <h2>Frequently asked questions</h2>
                  <div className="hc-faqlist">
                    {post.faqs.map((f, i) => (
                      <details className="hc-faqitem" name="hc-article-faq" key={i}>
                        <summary>
                          {f.question}
                          <span className="hc-faqmark" aria-hidden="true">
                            +
                          </span>
                        </summary>
                        <p>{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="hc-article-tags">
                  <TagList tags={post.tags} />
                </div>
              )}

              <ShareButtons title={post.title} slug={post.slug} />

              <AuthorCard author={post.author} />

              <div className="hc-ctapanel hc-artcta">
                <b>Have a question for our team?</b>
                <div className="hc-ctarow">
                  <a className="btn btn-primary" href="/contact#enquiry">
                    Send an enquiry
                  </a>
                  <a className="btn btn-ghost" href="/blog">
                    ← Back to all articles
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedArticles posts={related} />

      <Footer />
    </>
  );
}
