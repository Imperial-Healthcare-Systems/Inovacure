import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Partners — Inovacure Pharmaceuticals",
  description:
    "Clinic, pharmacy chain, international distributor or formulation partner — one reliable point of contact for quality-assured pharmaceutical supply.",
};

// Company page — Partners. The four partner tracks map to the brief's
// intent-segmented conversion model; copy grounded in the approved profile's
// partner-facing blocks (§03 closing, §05 differentiators).
const TRACKS = [
  {
    n: "01",
    name: "Distributors & PCD partners",
    href: "/contact#enquiry",
    img: "/assets/imagery/facility-supply.jpg",
    copy:
      "Territory-wise distribution built on honest pricing and dependable supply — with a named contact from first order to every reorder.",
    cta: "Start a distribution enquiry",
  },
  {
    n: "02",
    name: "Clinics & pharmacies",
    href: "/business/ethical-promotion",
    img: "/assets/imagery/pharmacist-shelf.jpg",
    copy:
      "Evidence-led promotion, approved product information and formulations your patients can afford — trust built the slow, honest way.",
    cta: "See how we promote",
  },
  {
    n: "03",
    name: "Export & international partners",
    href: "/business/pharma-exports",
    img: "/assets/imagery/blister-packs.jpg",
    copy:
      "Quality-assured formulations for your market through compliant, documented export channels — one desk, end to end.",
    cta: "Visit the export desk",
  },
  {
    n: "04",
    name: "Institutions & formulation partners",
    href: "/contact#enquiry",
    img: "/assets/imagery/bp-care-warm.jpg",
    copy:
      "From API supply to finished formulations — a partner that holds your quality bar because it is also our own.",
    cta: "Talk to us",
  },
];

export default function PartnersPage() {
  return (
    <>
      <SiteHeader active="partners" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Partners</b>
            </div>
            <span className="hc-kick">Partner with Inovacure</span>
            <h1>We grow when you grow.</h1>
            <p className="hc-lead">
              Clinic, pharmacy chain, international distributor or formulation
              partner — Inovacure is one reliable point of contact for
              quality-assured pharmaceutical supply.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras) — working together at the
            screen: partnership as a daily practice */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/consult-at-screen.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Why partners choose us</span>
            <h2>A partner you never have to double-check.</h2>
            <p>
              Everything we ask you to sell, stock or prescribe comes with the
              same three guarantees: fair pricing engineered in from the
              start, quality you can verify on paper, and promotion that never
              puts pressure where evidence should be.
            </p>
            <p>
              And because we are young, every partner matters to us in a way
              spreadsheets can&rsquo;t capture. You will not be account number
              four thousand. You may well be the story we tell for years.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Become a partner
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/doctor-warm-smile.jpg"
              alt="A partnership that starts with people"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Four ways in
          </span>
          <h2 data-reveal="mask">Start where it fits your business.</h2>
          <div className="hc-bizgrid">
            {TRACKS.map((t) => (
              <a key={t.n} className="hc-bizcard" href={t.href} data-reveal>
                <figure className="hc-bizimg">
                  <img src={t.img} alt="" loading="lazy" />
                  <span className="hc-bizno" aria-hidden="true">{t.n}</span>
                </figure>
                <b>{t.name}</b>
                <p>{t.copy}</p>
                <span className="hc-bizcta">{t.cta} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="hc-block hc-mkt">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">How we work</span>
            <h2>Partnership that outlasts the paperwork.</h2>
            <p>
              Agreements start relationships; they don&rsquo;t sustain them.
              What sustains them is a named contact who answers, evidence
              shared before it is asked for, and pricing that stays honest
              when nobody is checking.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Say hello to your named contact
            </a>
          </div>
          <div className="hc-glowfield" data-reveal>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <div className="hc-lightup">
              <b>
                One partner. Every <em>front.</em>
              </b>
              <small>
                Promotion · nutraceuticals · APIs · exports — under one roof.
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-how">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            The journey
          </span>
          <h2 data-reveal="mask">From first hello to long run.</h2>
          <div className="hc-steps">
            <span className="hc-stepline" data-drawline aria-hidden="true"></span>
            <div className="hc-step" data-reveal>
              <b>Reach out</b>
              <p>
                Tell us who you are and who you serve — form, email or
                WhatsApp. A named contact replies.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>See the evidence</b>
              <p>
                Product information, quality documentation and honest pricing
                — everything on the table first.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Agree the shape</b>
              <p>
                Territory, stocking or supply terms that fit your business —
                stated plainly, kept plainly.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Grow together</b>
              <p>
                New launches reach partners first. Your growth writes our
                story — that is the whole model.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Partner desk</span>
            <h2>Let&rsquo;s build your market together.</h2>
            <p>
              For distribution, stocking, exports or formulation partnership —
              we&rsquo;d be glad to hear from you.
            </p>
          </div>
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Partner enquiry</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>Partnership type</span>
              <span>▾</span>
            </span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Send partner enquiry
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
