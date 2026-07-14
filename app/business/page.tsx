import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Our Business — Inovacure Pharmaceuticals",
  description:
    "Branded formulations, nutraceuticals, APIs and export supply — four verticals, one dependable partner for global health.",
};

// Business hub — the /business landing every vertical breadcrumb and the nav
// point to. Same enhanced archetype head; body = the four verticals as photo
// cards (each vertical's own hero image as its thumbnail) + enquiry band.
// One-liners are the approved profile copy (§ verticals), verbatim.
const VERTICALS = [
  {
    n: "01",
    name: "Ethical Promotion",
    href: "/business/ethical-promotion",
    img: "/assets/imagery/pharmacist-shelf.jpg",
    copy:
      "Transparent, evidence-led promotion of branded formulations to clinicians and pharmacies — building trust rather than pressure.",
  },
  {
    n: "02",
    name: "Nutraceuticals",
    href: "/business/nutraceuticals",
    img: "/assets/imagery/fruit-flatlay.jpg",
    copy:
      "Functional wellness and nutrition products that support everyday health, from paediatric to adult care.",
  },
  {
    n: "03",
    name: "Active Pharmaceutical Ingredients",
    href: "/business/apis",
    img: "/assets/imagery/lab-wellplate.jpg",
    copy:
      "Reliable API sourcing and supply that underpins consistent, high-quality finished products.",
  },
  {
    n: "04",
    name: "Pharma Exports",
    href: "/business/pharma-exports",
    img: "/assets/imagery/blister-packs.jpg",
    copy:
      "Supplying quality-assured formulations to international markets through compliant, dependable export channels.",
  },
];

export default function BusinessHubPage() {
  return (
    <>
      <SiteHeader active="business" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Business</b>
            </div>
            <span className="hc-kick">Our business · Four verticals</span>
            <h1>One dependable partner.</h1>
            <p className="hc-lead">
              Branded formulations, nutraceuticals, APIs and export supply —
              in one dependable partner for global health.
            </p>
          </div>
        </div>
        {/* REAL client photography — three-brand pack shot from the company
            profile (manifest: owned imagery) */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/product-range.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Where we work
          </span>
          <h2 data-reveal="mask">Four ways we serve health.</h2>
          <div className="hc-bizgrid">
            {VERTICALS.map((v) => (
              <a key={v.n} className="hc-bizcard" href={v.href} data-reveal>
                <figure className="hc-bizimg">
                  <img src={v.img} alt="" loading="lazy" />
                  <span className="hc-bizno" aria-hidden="true">{v.n}</span>
                </figure>
                <b>{v.name}</b>
                <p>{v.copy}</p>
                <span className="hc-bizcta">Explore →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Work with us</span>
            <h2>Start where it fits your business.</h2>
            <p>
              Export buyer, distributor, clinician or manufacturer — every
              vertical has its own desk, and every enquiry gets a named
              contact.
            </p>
          </div>
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>General enquiry</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>Which vertical fits your enquiry?</span>
              <span>▾</span>
            </span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Send enquiry
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
