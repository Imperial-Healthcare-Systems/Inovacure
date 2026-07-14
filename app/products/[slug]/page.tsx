import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import { PRODUCTS, bySlug } from "@/components/products/products";

// Product detail — built TO working/V/comps/product.html (V1-approved),
// enhanced per archetype defaults. Informational only: no price, no buy;
// enquiry CTA + leaflet slot in its honest coming-soon state (leaflets are a
// pending client input). WhatsApp routes via /contact until the canonical
// number is confirmed on the fact sheet.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — Inovacure Pharmaceuticals`,
    description: `${p.blurb}. Informational listing with enquiry — availability through clinics, pharmacies and distribution partners.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const related = PRODUCTS.filter((r) => r.slug !== p.slug);

  return (
    <>
      <SiteHeader active="products" />

      {/* light page: fixed header needs an opaque backdrop until scroll — a
          slim dark strip carries the crumb like the comp's page top */}
      <header className="hc-pagehead hc-pdphead">
        <div className="wrap">
          <div className="hc-crumb">
            <a href="/">Home</a> · <a href="/products">Products</a> ·{" "}
            <a href="/products">{p.segment}</a> · <b>{p.brand}</b>
          </div>
        </div>
      </header>

      <section className="hc-block hc-pdp">
        <div className="wrap hc-pdpgrid">
          <div className="hc-media" data-reveal>
            <div className="hc-mediamain">
              <img
                src="/assets/imagery/product-range.jpg"
                alt={`${p.name} — from the first-launch range photograph`}
                style={{ objectPosition: p.shotPos }}
              />
            </div>
            <p className="hc-medianote">
              Range photograph from the company profile — dedicated product
              shots arrive with the leaflets.
            </p>
          </div>

          <div data-reveal>
            <span className="hc-pseg">
              {p.segment} · {p.form} · {p.range} range
            </span>
            <div className="hc-pdptitle">
              <h1>{p.name}</h1>
              <p className="hc-pdpsub">{p.blurb}</p>
            </div>
            <div className="hc-facts">
              {p.facts.map(([k, v]) => (
                <div className="hc-factrow" key={k}>
                  <span className="hc-factk">{k}</span>
                  <span className="hc-factv">{v}</span>
                </div>
              ))}
            </div>
            <ul className="hc-feat">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="hc-leaflet">
              <span className="hc-leafic" aria-hidden="true">PDF</span>
              <span>
                <b>Product leaflet — coming soon</b>
                <small>
                  Detailed composition and usage information will be available
                  for download here.
                </small>
              </span>
            </div>
            <div className="hc-ctapanel">
              <b>Interested in {p.brand}?</b>
              <div className="hc-ctarow">
                <a className="btn btn-primary" href="/contact#enquiry">
                  Enquire about this product
                </a>
                <a className="btn btn-ghost" href="/contact#enquiry">
                  Message the product desk
                </a>
              </div>
              <small>
                Doctors: request evidence-led product information.
                Distributors: ask about territory availability.
              </small>
            </div>
            <p className="hc-rxnote">
              Informational listing — not an offer for online sale. Please
              consult a qualified healthcare professional before use.
            </p>
          </div>
        </div>
      </section>

      <section className="hc-block hc-rel">
        <div className="wrap">
          <h2 data-reveal="mask">Also from the launch range</h2>
          <div className="hc-relgrid">
            {related.map((r) => (
              <a className="hc-relc" key={r.slug} href={`/products/${r.slug}`} data-reveal>
                <img src={r.logo} alt={r.brand} loading="lazy" />
                <b>{r.brand}</b>
                <span>
                  {r.blurb} · {r.pack}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
