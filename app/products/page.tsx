import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import CatalogBrowser from "@/components/products/CatalogBrowser";

export const metadata: Metadata = {
  title: "Products — Inovacure Pharmaceuticals",
  description:
    "Browse Inovacure's growing catalog by therapeutic segment or dosage form. Informational listings with enquiry — no online sales.",
};

// Catalog page — built TO working/V/comps/catalog.html (V1-approved), then
// enhanced per the standing archetype defaults (SiteHeader, split image head,
// reveals). Real data only: the three first-launch products; the comp's
// 8-card grid was explicit comp-filler. Enquiry-driven, no prices, no cart.
export default function ProductsPage() {
  return (
    <>
      <SiteHeader active="products" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Products</b>
            </div>
            <span className="hc-kick">Product catalog</span>
            <h1>A growing family of trusted products.</h1>
            <p className="hc-lead">
              Browse by therapeutic segment or dosage form. Products are shown
              for information — availability is through clinics, pharmacies
              and our distribution partners.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras b2) — bright pharmacy
            interior: shelves of products = a catalog, with real depth */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/pharmacy-interior.jpg" alt="" />
        </div>
      </header>

      <CatalogBrowser />

      <Footer />
    </>
  );
}
