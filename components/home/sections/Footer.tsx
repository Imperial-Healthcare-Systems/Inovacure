// Beat 8 — footer, built to home-C.html + enhanced (column stagger, DS green
// underline on link hover, sunrise hairline at the top edge). Standard static
// footer — sticky-reveal dropped by client edit 2026-07-13. Contact facts come
// from lib/site/company.ts. WhatsApp published; voice-call reachability still
// unconfirmed, so it is shown as WhatsApp-only (no tel: link).
import { COMPANY as INFO, MAP, WHATSAPP_URL } from "@/lib/site/company";

const BUSINESS = [
  { label: "Ethical Promotion", href: "/business/ethical-promotion" },
  { label: "Nutraceuticals", href: "/business/nutraceuticals" },
  { label: "APIs", href: "/business/apis" },
  { label: "Pharma Exports", href: "/business/pharma-exports" },
];
const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Quality", href: "/quality" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="hc-foot">
      {/* sunset echo of the hero: same arc geometry, resting below the horizon */}
      <div className="hc-footarcs" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="wrap">
        <div className="hc-cols">
          <div data-reveal>
            <a className="hc-logochip" href="/" aria-label="Inovacure — home">
              <img
                src="/assets/brand/logo-horizontal.svg"
                alt="Inovacure — Live Healthy"
              />
            </a>
            <p style={{ marginTop: 14, maxWidth: "30ch" }}>
              Affordable, quality-assured medicines for healthier lives.
            </p>
          </div>
          <div data-reveal>
            <h4>Business</h4>
            <ul>
              {BUSINESS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h4>Company</h4>
            <ul>
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <h4>Get in touch</h4>
            <ul>
              <li>{INFO.address.oneLine}</li>
              <li>
                <a href={MAP.placeUrl} target="_blank" rel="noopener">
                  View on map ↗
                </a>
              </li>
              <li>
                <a href={`mailto:${INFO.email}`}>{INFO.email}</a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener">
                  WhatsApp {INFO.whatsapp.e164}
                </a>
              </li>
              <li>
                <a href={INFO.website}>{INFO.websiteDisplay}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="hc-legal">
          <span>© 2026 Inovacure Pharmaceuticals LLP. All rights reserved.</span>
          <span className="hc-lh">Live Healthy.</span>
          <span>
            <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> ·{" "}
            <a href="/disclaimer">Disclaimer</a>
          </span>
          <a className="hc-totop" href="#" aria-label="Back to top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
