// Beat 1 — Nav + Hero, built TO project/working/V/comps/home-C.html (V1-approved).
// Mega-menu panels are a later human-gated beat: nav ships plain links + carets.
// Copy is comp-verbatim; content baseline is still v0-draft (client approval pending).
export default function Hero() {
  return (
    <header className="hc-hero" data-hero-dawn>
      <nav className="hc-nav" aria-label="Primary">
        <div className="wrap">
          <a className="hc-logochip" href="/" aria-label="Inovacure — home">
            <img
              src="/assets/brand/logo-horizontal.svg"
              alt="Inovacure — Live Healthy"
              height={32}
            />
          </a>
          <div className="hc-menu">
            <a href="/business">
              Business <span className="hc-caret">▾</span>
            </a>
            <a href="/products">
              Products <span className="hc-caret">▾</span>
            </a>
            <a href="/about">About</a>
            <a href="/quality">Quality</a>
            <a href="/partners">Partners</a>
            <a href="/contact">Contact</a>
          </div>
          <a
            className="btn btn-green"
            style={{ padding: "11px 22px" }}
            href="/contact#enquiry"
          >
            Enquire now
          </a>
        </div>
      </nav>
      <div className="hc-night" aria-hidden="true"></div>
      <div className="hc-stars" aria-hidden="true">
        <i></i>
        <i></i>
      </div>
      <div className="hc-arcs" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="hc-sun" aria-hidden="true"></div>
      <div className="wrap">
        <span className="hc-kick" data-load-seq>
          A new sun is born
        </span>
        <h1 data-load-seq data-mask>
          Medicine that reaches <em>everyone</em> it should.
        </h1>
        <p data-load-seq>
          Inovacure Pharmaceuticals LLP develops, markets and distributes
          high-quality, affordable medicines across multiple therapeutic
          segments — built on ethical practice, scientific rigour, and access
          for all.
        </p>
        <div className="hc-row" data-load-seq>
          <a className="btn btn-green" href="/business">
            Explore our business
          </a>
          <a className="btn btn-ghost-dark" href="/contact#enquiry">
            Partner with us
          </a>
        </div>
      </div>
      <span className="hc-scroll" aria-hidden="true">
        Scroll ↓
      </span>
    </header>
  );
}
