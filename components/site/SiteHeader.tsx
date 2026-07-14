"use client";

// Site header v3 — BTB condensing mechanic (v2) + human-picked mega-menu:
// rich visual panels for Business ▾ / Products ▾ (photo cards + featured
// product) and a full-screen dawn overlay behind a burger under 980px.
// Panels open on hover/focus, close on Escape / mouseleave; overlay locks
// body scroll. ⟲ RM: transitions collapse to instant via media query.
import { useEffect, useState } from "react";
import { PRODUCTS } from "@/components/products/products";

const LINKS = [
  { label: "Business", href: "/business", caret: true, key: "business" },
  { label: "Products", href: "/products", caret: true, key: "products" },
  { label: "About", href: "/about", key: "about" },
  { label: "Quality", href: "/quality", key: "quality" },
  { label: "Partners", href: "/partners", key: "partners" },
  { label: "Contact", href: "/contact", key: "contact" },
];

const VERTICALS = [
  {
    n: "01",
    name: "Ethical Promotion",
    href: "/business/ethical-promotion",
    img: "/assets/imagery/pharmacist-shelf.jpg",
    line: "Trust over pressure",
  },
  {
    n: "02",
    name: "Nutraceuticals",
    href: "/business/nutraceuticals",
    img: "/assets/imagery/fruit-flatlay.jpg",
    line: "Wellness for every age",
  },
  {
    n: "03",
    name: "APIs",
    href: "/business/apis",
    img: "/assets/imagery/lab-wellplate.jpg",
    line: "The ingredient you rely on",
  },
  {
    n: "04",
    name: "Pharma Exports",
    href: "/business/pharma-exports",
    img: "/assets/imagery/blister-packs.jpg",
    line: "Quality, worldwide",
  },
];

type Panel = "business" | "products" | null;

export default function SiteHeader({ active }: { active?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [mobile, setMobile] = useState(false);
  const [mExpand, setMExpand] = useState<Panel>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header
      className={`hc-sitehead${scrolled ? " is-scrolled" : ""}${panel ? " has-panel" : ""}`}
      onMouseLeave={() => setPanel(null)}
    >
      <div className="wrap">
        <a className="hc-logochip" href="/" aria-label="Inovacure — home">
          <img src="/assets/brand/logo-horizontal.svg" alt="Inovacure — Live Healthy" />
        </a>
        <nav className="hc-sitemenu" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className={active === l.key ? "on" : undefined}
              aria-expanded={l.caret ? panel === l.key : undefined}
              onMouseEnter={() => setPanel(l.caret ? (l.key as Panel) : null)}
              onFocus={() => setPanel(l.caret ? (l.key as Panel) : null)}
            >
              {l.label}
              {l.caret && <span className="hc-caret"> ▾</span>}
            </a>
          ))}
        </nav>
        <a className="btn btn-green hc-headcta" href="/contact#enquiry">
          Enquire now
        </a>
        <button
          className="hc-burger"
          aria-label={mobile ? "Close menu" : "Open menu"}
          aria-expanded={mobile}
          onClick={() => setMobile((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* --- rich mega panels (desktop) --- */}
      <div
        className={`hc-megapanel${panel === "business" ? " open" : ""}`}
        aria-hidden={panel !== "business"}
      >
        <div className="wrap hc-megabiz">
          {VERTICALS.map((v) => (
            <a key={v.n} className="hc-megacard" href={v.href} tabIndex={panel === "business" ? 0 : -1}>
              <figure>
                <img src={v.img} alt="" loading="lazy" />
              </figure>
              <span className="hc-megano">{v.n}</span>
              <b>{v.name}</b>
              <small>{v.line} →</small>
            </a>
          ))}
          <a className="hc-megall" href="/business" tabIndex={panel === "business" ? 0 : -1}>
            Explore all business →
          </a>
        </div>
      </div>
      <div
        className={`hc-megapanel${panel === "products" ? " open" : ""}`}
        aria-hidden={panel !== "products"}
      >
        <div className="wrap hc-megaprod">
          <div className="hc-megacol">
            <span className="hc-megalbl">First launch</span>
            {PRODUCTS.map((p) => (
              <a key={p.slug} className="hc-megaitem" href={`/products/${p.slug}`} tabIndex={panel === "products" ? 0 : -1}>
                <img src={p.logo} alt="" loading="lazy" />
                <span>
                  <b>{p.brand}</b>
                  <small>{p.blurb}</small>
                </span>
              </a>
            ))}
          </div>
          <div className="hc-megacol">
            <span className="hc-megalbl">By segment</span>
            <a className="hc-megalink" href="/products" tabIndex={panel === "products" ? 0 : -1}>Ophthalmology</a>
            <a className="hc-megalink" href="/products" tabIndex={panel === "products" ? 0 : -1}>Paediatric nutrition</a>
            <span className="hc-megalbl" style={{ marginTop: 14 }}>By range</span>
            <a className="hc-megalink" href="/products" tabIndex={panel === "products" ? 0 : -1}>Ethical</a>
            <a className="hc-megalink" href="/products" tabIndex={panel === "products" ? 0 : -1}>Nutraceutical</a>
          </div>
          <a className="hc-megafeat" href="/products" tabIndex={panel === "products" ? 0 : -1}>
            <img src="/assets/imagery/product-range.jpg" alt="" loading="lazy" />
            <span>
              <b>A growing family of trusted products</b>
              <small>Browse the catalog →</small>
            </span>
          </a>
        </div>
      </div>

      {/* --- full-screen mobile overlay --- */}
      <div className={`hc-mobilenav${mobile ? " open" : ""}`} aria-hidden={!mobile}>
        <nav aria-label="Mobile">
          {(["business", "products"] as const).map((k) => (
            <div key={k} className={`hc-mobgroup${mExpand === k ? " open" : ""}`}>
              <button onClick={() => setMExpand(mExpand === k ? null : k)} aria-expanded={mExpand === k}>
                {k === "business" ? "Business" : "Products"} <span>▾</span>
              </button>
              <div className="hc-mobsub">
                {k === "business" ? (
                  <>
                    {VERTICALS.map((v) => (
                      <a key={v.n} href={v.href}>{v.name}</a>
                    ))}
                    <a href="/business">All business →</a>
                  </>
                ) : (
                  <>
                    {PRODUCTS.map((p) => (
                      <a key={p.slug} href={`/products/${p.slug}`}>{p.brand}</a>
                    ))}
                    <a href="/products">Full catalog →</a>
                  </>
                )}
              </div>
            </div>
          ))}
          {LINKS.filter((l) => !l.caret).map((l) => (
            <a key={l.key} className="hc-moblink" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-green hc-mobcta" href="/contact#enquiry">
          Enquire now
        </a>
      </div>
    </header>
  );
}
