import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "About — Inovacure Pharmaceuticals",
  description:
    "A new sun is born. Inovacure Pharmaceuticals LLP makes high-quality treatment affordable and accessible — built on ethical practice, scientific rigour, and access for all.",
};

// Company page — About. Copy authored from the approved profile blocks
// (working/C/company-profile-source.md §01/§02/§05), elevated per the human's
// world-class-copy directive; no invented facts, stats or history.
export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>About</b>
            </div>
            <span className="hc-kick">About Inovacure</span>
            <h1>A new sun is born.</h1>
            <p className="hc-lead">
              Inovacure exists because good health should never be a privilege.
              We are an India-based pharmaceutical company making high-quality
              treatment affordable, accessible — and honest.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras b2) — warmth in daylight; the
            "new sun" read against the dawn-dark band */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img
            src="/assets/imagery/doctor-warm-smile.jpg"
            alt=""
            style={{ objectPosition: "center 18%" }}
          />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Who we are</span>
            <h2>Medicine that reaches everyone it should.</h2>
            <p>
              From Noida, in the heart of the Delhi-NCR pharmaceutical
              corridor, we develop, market and distribute trusted products
              across therapeutic segments — from eye care and dermatology to
              everyday wellness and paediatric nutrition.
            </p>
            <p>
              The order of those words matters: trusted first, then
              distributed. Rigorous safety and efficacy standards, sustainable
              manufacturing and honest promotion — for the clinics, pharmacies
              and families who take us at our word.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/business">
              See how we work
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/bp-care-warm.jpg"
              alt="Care delivered up close — the people our medicines reach"
              loading="lazy"
            />
          </div>
        </div>
        {/* the four pillars, from the approved profile */}
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

      <section className="hc-block hc-mkt">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Our purpose</span>
            <h2>Quality medicine everyone can afford. Everywhere.</h2>
            <p>
              Our mission is simple to say and hard to do: promote health
              globally with affordable, high-quality medications — holding the
              line on safety and effectiveness, manufacturing sustainably, and
              marketing responsibly in every part of our operations.
            </p>
            <p>
              Our vision is a world where quality healthcare stays within
              reach of every individual, whatever their economic
              circumstances.
            </p>
          </div>
          <div className="hc-glowfield" data-reveal>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <div className="hc-lightup">
              <b>
                Our promise, in two words — <em>Live&nbsp;Healthy.</em>
              </b>
              <small>Noida, India — rising for global health.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            What we stand on
          </span>
          <h2 data-reveal="mask">Six things we refuse to compromise.</h2>
          <div className="hc-pgrid hc-valgrid">
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">₹</span>
              <b>Affordability without compromise</b>
              <p>
                Fair pricing is engineered into the product from the start —
                so cost is never the reason someone goes untreated.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">✓</span>
              <b>Quality you can verify</b>
              <p>
                Tested for efficacy and potency, held to strict standards for
                safety and effectiveness — ask us for the documentation.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">⚖</span>
              <b>Ethical by default</b>
              <p>
                Honest, evidence-based promotion and responsible conduct in
                every relationship — trust is our only sales technique.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">♻</span>
              <b>Sustainable practice</b>
              <p>
                Manufacturing and marketing that respect people and planet —
                because health includes the world we live in.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">✚</span>
              <b>Broad, useful portfolio</b>
              <p>
                From eye care to paediatric nutrition — practical answers to a
                wide range of everyday health needs.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <span className="hc-ic" aria-hidden="true">◎</span>
              <b>Built for reach</b>
              <p>
                Domestic promotion, nutraceuticals, API supply and exports —
                one dependable partner, four ways to serve health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Our story so far</span>
            <h2>Young — and proud of it.</h2>
            <p>
              We won&rsquo;t point to decades of legacy, because we
              don&rsquo;t have them. What we have instead is rarer: a clean
              sheet, and the discipline to fill it carefully. Every process,
              every price and every promise here was made fresh — nothing
              inherited, nothing assumed.
            </p>
            <p>
              That is what &ldquo;A New Sun is Born&rdquo; means to us. Not a
              slogan about size, but a commitment about direction: we would
              rather earn trust than claim it.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/products">
              Meet our first products
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/product-range.jpg"
              alt="The first Inovacure launch range — Oclean, Hytran, Kidzea"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Talk to us</span>
            <h2>Partner with us for healthier lives.</h2>
            <p>
              For product enquiries, distribution, exports or partnership —
              we&rsquo;d be glad to hear from you.
            </p>
          </div>
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Say hello</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Start the conversation
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
