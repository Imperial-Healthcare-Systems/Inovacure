import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import EnquiryPanel from "@/components/site/EnquiryPanel";
import { COMPANY, MAP, WHATSAPP_URL } from "@/lib/site/company";

export const metadata: Metadata = {
  title: "Contact — Inovacure Pharmaceuticals",
  description:
    "For product enquiries, distribution, exports or partnership — we'd be glad to hear from you. Inovacure Pharmaceuticals LLP, Noida, India.",
};

// Company page — Contact: the conversion hub every /contact#enquiry CTA on
// the site lands on. Contact facts come from lib/site/company.ts (single source
// of truth). WhatsApp is now published; voice-call reachability of the number
// is still unconfirmed, so it is presented as WhatsApp-only (no tel: link).
export default function ContactPage() {
  return (
    <>
      <SiteHeader active="contact" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Contact</b>
            </div>
            <span className="hc-kick">Contact Inovacure</span>
            <h1>We&rsquo;d be glad to hear from you.</h1>
            <p className="hc-lead">
              For product enquiries, distribution, exports or partnership —
              one message starts it. Real people read these, and a named
              contact answers.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras) — a person, not a switchboard */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img
            src="/assets/imagery/smiling-clinician.jpg"
            alt=""
            style={{ objectPosition: "center 22%" }}
          />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap">
          <div className="hc-rails">
            <a
              className="hc-rail"
              href={`mailto:${COMPANY.email}`}
              data-reveal
            >
              <span className="hc-ic" aria-hidden="true">✉</span>
              <b>Email us</b>
              <p>{COMPANY.email}</p>
              <span className="hc-railcta">Write to us →</span>
            </a>
            <a
              className="hc-rail"
              href={MAP.placeUrl}
              target="_blank"
              rel="noopener"
              data-reveal
            >
              <span className="hc-ic" aria-hidden="true">◎</span>
              <b>Registered office</b>
              <p>
                {COMPANY.address.lines[0]}
                <br />
                {COMPANY.address.lines[1]}
              </p>
              <span className="hc-railcta">View on Google Maps →</span>
            </a>
            <a
              className="hc-rail"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              data-reveal
            >
              <span className="hc-ic" aria-hidden="true">☏</span>
              <b>WhatsApp</b>
              <p>{COMPANY.whatsapp.e164}</p>
              <span className="hc-railcta">Message us on WhatsApp →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="hc-block hc-findus">
        <div className="wrap">
          <div className="hc-findhead" data-reveal>
            <span className="eyebrow">Find us</span>
            <h2>Visit our registered office</h2>
            <p>{COMPANY.address.lines.join(", ")}</p>
          </div>
          <div className="hc-mapwrap" data-reveal="mask">
            <div className="hc-mapframe">
              <iframe
                title={`Map — ${COMPANY.legalName} registered office, Urbtech Trade Centre, Sector 132, Noida`}
                src={MAP.embedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              className="btn btn-primary hc-mapdir"
              href={MAP.directionsUrl}
              target="_blank"
              rel="noopener"
            >
              Get directions
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Enquiry desk
          </span>
          <h2 data-reveal="mask">Tell us who you are — we&rsquo;ll take it from there.</h2>
          <p className="hc-enqlead" data-reveal>
            Pick the lane that fits and your enquiry lands with the right desk
            on the first try.
          </p>
          <EnquiryPanel />
        </div>
      </section>

      <Footer />
    </>
  );
}
