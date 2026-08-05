// Beat 8 — footer, built to home-C.html + enhanced (column stagger, DS green
// underline on link hover, sunrise hairline at the top edge). Standard static
// footer — sticky-reveal dropped by client edit 2026-07-13. Contact facts come
// from lib/site/company.ts. WhatsApp published; voice-call reachability still
// unconfirmed, so it is shown as WhatsApp-only (no tel: link).
import { COMPANY as INFO, MAP, SOCIAL, WHATSAPP_URL } from "@/lib/site/company";

// Brand glyphs, inlined so the footer costs no extra request. `currentColor`
// lets them inherit the hover treatment from the CSS. The linkedin glyph is
// deliberately kept while SOCIAL has no LinkedIn entry (see company.ts) — it
// makes restoring the link a one-line change once a public URL exists.
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
  ),
};

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
            <ul className="hc-footsocial" aria-label="Inovacure on social media">
              {SOCIAL.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Inovacure on ${s.label}`}
                    title={s.label}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      {SOCIAL_ICONS[s.key]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
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
