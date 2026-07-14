// Beat 1 — Hero, built TO project/working/V/comps/home-C.html (V1-approved).
// The home nav unified with the sitewide SiteHeader (mega-menu + mobile burger)
// at the platforming swap beat — SiteHeader is rendered once at the page level
// (app/page.tsx), so the hero no longer carries its own <nav>. The dawn intro's
// nav-fade in SiteRuntime is guarded (`if (nav)`) and simply no-ops now.
// Copy is comp-verbatim; content baseline is still v0-draft (client approval pending).
export default function Hero() {
  return (
    <header className="hc-hero" data-hero-dawn>
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
