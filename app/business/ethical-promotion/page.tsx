import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Ethical Promotion — Inovacure Pharmaceuticals",
  description:
    "Transparent, evidence-led promotion of branded formulations to clinicians and pharmacies — building trust rather than pressure.",
};

// Vertical page 01 — Ethical Promotion. Adapts the human-signed exports
// archetype (split image head, photo proof cards, dark spark band, steps,
// enquiry mock) with copy grounded in working/C/company-profile-source.md.
// Warmth-leaning imagery per the calibration-logged preference.
export default function EthicalPromotionPage() {
  return (
    <>
      <SiteHeader active="business" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <a href="/business">Business</a> ·{" "}
              <b>Ethical Promotion</b>
            </div>
            <span className="hc-kick">Vertical 01 · Ethical Promotion</span>
            <h1>Promotion that earns trust.</h1>
            <p className="hc-lead">
              Transparent, evidence-led promotion of branded formulations to
              clinicians and pharmacies — building trust rather than pressure.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras b2) — warm pharmacist at the
            shelf: literally this vertical's audience, warmth per the logged
            imagery preference */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img
            src="/assets/imagery/pharmacist-shelf.jpg"
            alt=""
            style={{ objectPosition: "center 30%" }}
          />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Why clinicians work with us</span>
            <h2>Evidence-led, ethical by default.</h2>
            <p>
              Every conversation starts with approved product information —
              composition, quality documentation and honest pricing, stated
              plainly. No inflated claims, no pressure.
            </p>
            <p>
              For clinics and pharmacies, that means a partner whose branded
              formulations you can recommend with confidence — quality-assured,
              and affordable for the people you serve.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Talk to our team
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/doctor-portrait.jpg"
              alt="A clinician partnering with Inovacure"
              loading="lazy"
            />
          </div>
        </div>
        {/* four pillars from the approved profile (§01) — ignite on reveal */}
        <div className="wrap hc-pillars">
          <div className="hc-pillar" data-reveal>
            <b>Quality</b>
            <p>Tested for efficacy &amp; potency</p>
          </div>
          <div className="hc-pillar" data-reveal>
            <b>Access</b>
            <p>Priced for all</p>
          </div>
          <div className="hc-pillar" data-reveal>
            <b>Ethics</b>
            <p>Honest promotion</p>
          </div>
          <div className="hc-pillar" data-reveal>
            <b>Reach</b>
            <p>Domestic &amp; export</p>
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            How we promote
          </span>
          <h2 data-reveal="mask">Evidence first. Always.</h2>
          <div className="hc-pgrid">
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/doctor-phone.jpg" alt="A professional reviewing approved product information" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">☰</span>
              <b>Approved information only</b>
              <p>
                Product literature, composition and quality documentation for
                every formulation — shared transparently, exactly as approved.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/stethoscope-closeup.jpg" alt="Clinical practice" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✚</span>
              <b>Built for practice</b>
              <p>
                Branded formulations across our therapeutic segments — from
                ophthalmology to dermatology — selected for everyday clinical
                relevance.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/mask-stethoscope.jpg" alt="Responsible, everyday medical practice" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✓</span>
              <b>Responsible marketing</b>
              <p>
                Honest, evidence-based promotion and responsible business
                conduct across every relationship — recommendations grounded in
                evidence, never pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-mkt">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Ethical by default</span>
            <h2>The prescription is the doctor&rsquo;s. The proof is ours.</h2>
            <p>
              We put approved evidence on the table and let it speak. That is
              the whole model — sustainable manufacturing, responsible
              marketing and ethical conduct across every part of our
              operations.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Request product information
            </a>
          </div>
          <div className="hc-glowfield" data-reveal>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <div className="hc-lightup">
              <b>
                Built on evidence. Carried by <em>trust.</em>
              </b>
              <small>
                Honest, evidence-based promotion — across every relationship.
              </small>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-how">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            How it works
          </span>
          <h2 data-reveal="mask">From first call to ongoing support.</h2>
          <div className="hc-steps">
            <span className="hc-stepline" data-drawline aria-hidden="true"></span>
            <div className="hc-step" data-reveal>
              <b>Connect</b>
              <p>
                Tell us about your clinic, pharmacy or practice — form, email
                or WhatsApp.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Review the evidence</b>
              <p>
                Approved product information and literature for every
                formulation you are considering.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Stock with confidence</b>
              <p>
                Availability and terms agreed clearly, built on honest pricing
                — no pressure at any step.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Stay supported</b>
              <p>
                A named contact keeps you updated as the portfolio grows —
                from first order to every reorder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Clinician &amp; pharmacy desk</span>
            <h2>Bring Inovacure into your practice.</h2>
            <p>
              For product information, stocking enquiries and evidence
              literature — we&rsquo;d be glad to hear from you.
            </p>
          </div>
          {/* visual mock per archetype — the live form lands in the
              enquiry-system beat; until then the card routes to contact */}
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Clinician &amp; pharmacy enquiry</b>
            <span className="hc-mf">Name · Clinic / Pharmacy</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>I am a… (doctor · pharmacist · other)</span>
              <span>▾</span>
            </span>
            <span className="hc-mf sel">
              <span>Products / segments of interest</span>
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
