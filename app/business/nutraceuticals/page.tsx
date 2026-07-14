import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Nutraceuticals — Inovacure Pharmaceuticals",
  description:
    "Functional wellness and nutrition products that support everyday health — from paediatric to adult care, made with pharmaceutical discipline.",
};

// Vertical page 02 — Nutraceuticals. Adapts the human-signed enhanced
// archetype. Copy grounded in working/C/company-profile-source.md; Kidzea
// spotlight per the brief's first-launch goal (descriptor-free: form/flavor
// still TBC on the fact sheet). Enquiry-only — no commerce surfaces.
export default function NutraceuticalsPage() {
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
              <b>Nutraceuticals</b>
            </div>
            <span className="hc-kick">Vertical 02 · Nutraceuticals</span>
            <h1>Wellness for every age.</h1>
            <p className="hc-lead">
              Functional wellness and nutrition products that support everyday
              health — from paediatric to adult care, made with pharmaceutical
              discipline.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras b2/n) — vibrant fruit flat-lay:
            colour + freshness signal wellness against the deep blue band */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/fruit-flatlay.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Everyday nutrition</span>
            <h2>Health you keep in the routine.</h2>
            <p>
              Nutrition only works when it is taken every day — so we make
              wellness products families actually keep in the routine:
              functional, honest about what they contain, and priced for
              everyday life.
            </p>
            <p>
              Behind every product stands the same quality-first discipline as
              our medicines — tested for what the label promises, from
              paediatric to adult care.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Enquire about the range
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/child-joy.jpg"
              alt="A joyful child — nutrition from paediatric to adult care"
              loading="lazy"
            />
          </div>
        </div>
        {/* first-launch spotlight (brief goal) — descriptor kept form-free
            until the fact sheet confirms the Kidzea line details */}
        <div className="wrap">
          <a className="hc-spot" href="/contact#enquiry" data-reveal>
            <span className="hc-spotlogo">
              <img src="/assets/products/first-launch/kidzea.jpeg" alt="Kidzea" />
            </span>
            <span className="hc-spottext">
              <b>First from the range — Kidzea</b>
              <span>
                Paediatric nutrition, made to be loved by kids. Ask us about
                the line and availability.
              </span>
            </span>
            <span className="hc-spotcta">Enquire →</span>
          </a>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            What we make
          </span>
          <h2 data-reveal="mask">Wellness with a pharma backbone.</h2>
          <div className="hc-pgrid">
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/healthy-bowl.jpg" alt="Everyday functional nutrition" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✚</span>
              <b>Functional by design</b>
              <p>
                Products built around a clear everyday purpose — supporting
                nutrition, not chasing trends.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/berry-smoothie.jpg" alt="Formats made enjoyable" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">☺</span>
              <b>Paediatric to adult</b>
              <p>
                Formats children accept and adults stick with — because the
                best nutrition is the one that actually gets taken.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/lab-quality.jpg" alt="Pharmaceutical quality control" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✓</span>
              <b>Pharma-grade discipline</b>
              <p>
                Made under the same quality systems as our formulations —
                tested for what the label promises, nothing more claimed.
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
            <span className="eyebrow">Our promise</span>
            <h2>Two words, taken daily.</h2>
            <p>
              Everything in this vertical exists to make our promise practical
              — wellness that is honest about what it contains, affordable
              enough to stay in the routine, and made to be enjoyed.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Talk nutraceuticals with us
            </a>
          </div>
          <div className="hc-glowfield" data-reveal>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <div className="hc-lightup">
              <b>
                Live <em>Healthy.</em>
              </b>
              <small>
                Functional wellness and nutrition — paediatric to adult.
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
          <h2 data-reveal="mask">From first look to lasting shelf space.</h2>
          <div className="hc-steps">
            <span className="hc-stepline" data-drawline aria-hidden="true"></span>
            <div className="hc-step" data-reveal>
              <b>Explore the range</b>
              <p>
                Tell us who you serve — we share the current nutraceutical
                line-up and what is launching next.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Review the specs</b>
              <p>
                Composition and quality documentation for every product,
                stated plainly.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Partner up</b>
              <p>
                Distribution and stocking terms built on honest pricing — for
                pharmacies, distributors and institutions.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Grow together</b>
              <p>
                New launches reach you first — one named contact as the range
                expands.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Nutraceutical desk</span>
            <h2>Put wellness on your shelves.</h2>
            <p>
              For the product line-up, specifications and distribution terms —
              we&rsquo;d be glad to hear from you.
            </p>
          </div>
          {/* visual mock per archetype — live form lands in the
              enquiry-system beat; the card routes to contact until then */}
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Nutraceutical enquiry</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>I am a… (distributor · pharmacy · other)</span>
              <span>▾</span>
            </span>
            <span className="hc-mf sel">
              <span>Products of interest</span>
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
