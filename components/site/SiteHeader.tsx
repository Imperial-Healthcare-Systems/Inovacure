"use client";

// Site header v2 — behaviour ported from the BTB/ylem reference (mechanics
// only, re-skinned 100%): fixed bar riding transparent over the dark page
// head, condensing on scroll (>40px) into a blurred light bar with a hairline
// edge; logo chip and padding shrink with it. Look matches the signed-off
// home nav (big trimmed logo chip, menu, green CTA). Mega-menu panels +
// mobile drawer remain a later human-gated beat.
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Business", href: "/business", caret: true, key: "business" },
  { label: "Products", href: "/products", caret: true, key: "products" },
  { label: "About", href: "/about", key: "about" },
  { label: "Quality", href: "/quality", key: "quality" },
  { label: "Partners", href: "/partners", key: "partners" },
  { label: "Contact", href: "/contact", key: "contact" },
];

export default function SiteHeader({ active }: { active?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`hc-sitehead${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap">
        <a className="hc-logochip" href="/" aria-label="Inovacure — home">
          <img src="/assets/brand/logo-horizontal.svg" alt="Inovacure — Live Healthy" />
        </a>
        <nav className="hc-sitemenu" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.key} href={l.href} className={active === l.key ? "on" : undefined}>
              {l.label}
              {l.caret && <span className="hc-caret"> ▾</span>}
            </a>
          ))}
        </nav>
        <a className="btn btn-green hc-headcta" href="/contact#enquiry">
          Enquire now
        </a>
      </div>
    </header>
  );
}
