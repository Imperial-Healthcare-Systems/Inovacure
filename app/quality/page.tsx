import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Quality — Inovacure Pharmaceuticals",
  description:
    "Tested for efficacy and potency, held to strict standards for safety and effectiveness. Quality is the standard behind the Live Healthy promise.",
};

// Company page — Quality. Claims limited strictly to the approved profile
// (tested for efficacy & potency; safety/effectiveness standards; sustainable
// practice). The certification wall ships in its honest state — dashed slots,
// published only as documents are confirmed (fact sheet pending).
export default function QualityPage() {
  return (
    <>
      <SiteHeader active="quality" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Quality</b>
            </div>
            <span className="hc-kick">Quality &amp; standards</span>
            <h1>The standard behind the promise.</h1>
            <p className="hc-lead">
              Live Healthy is two words we have to earn every single batch.
              Every Inovacure product is tested for efficacy and potency, and
              held to strict standards for safety and effectiveness.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras) — QC laboratory at work;
            bright photo → dim variant protects the headline zone */}
        <div className="hc-headimg dim" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/lab-quality.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Our discipline</span>
            <h2>Affordable is easy. Affordable and right is the work.</h2>
            <p>
              Anyone can cut a price by cutting a corner. Our whole model
              depends on refusing that trade: fair pricing engineered into the
              product from the start, with quality held constant — tested,
              documented and stood behind.
            </p>
            <p>
              That is why our promotion can afford to be honest and our
              partners can afford to rely on us. Quality is not a department
              here; it is the business plan.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Request quality documentation
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/cover-pills-lab.jpg"
              alt="Inovacure formulation work — from the company profile"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            What that means in practice
          </span>
          <h2 data-reveal="mask">Three habits we never skip.</h2>
          <div className="hc-pgrid">
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/lab-wellplate.jpg" alt="Testing in the laboratory" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✓</span>
              <b>Tested, not assumed</b>
              <p>
                Efficacy and potency are verified, not presumed — every
                product is held to strict standards for safety and
                effectiveness.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/docs-desk.jpg" alt="Documentation work" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">☰</span>
              <b>Documented, then shipped</b>
              <p>
                Quality documentation travels with our products and is shared
                with partners on request — plainly, before commitment.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/facility-supply.jpg" alt="Sustainable, consistent supply" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">♻</span>
              <b>Sustainable by commitment</b>
              <p>
                Manufacturing and marketing that respect people and planet —
                consistency you can repeat, order after order.
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
            <span className="eyebrow">Certifications</span>
            <h2>Published when proven. Never before.</h2>
            <p>
              This wall fills in exactly as certifications are confirmed — the
              same honesty we ask of our own suppliers. Until then, current
              quality documentation is always available to partners on
              request.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Ask for current documentation
            </a>
          </div>
          {/* honest-state certification wall — dashed slots, no invented
              credentials; goes live from the fact sheet */}
          <div className="hc-certwall" data-reveal aria-label="Certification wall — published as confirmed">
            <div className="hc-certslot" aria-hidden="true"><span>Certification</span></div>
            <div className="hc-certslot" aria-hidden="true"><span>Certification</span></div>
            <div className="hc-certslot" aria-hidden="true"><span>Certification</span></div>
            <div className="hc-certslot" aria-hidden="true"><span>Certification</span></div>
            <div className="hc-certnote">
              Reserved for confirmed credentials —{" "}
              <a href="/contact#enquiry">request our current documentation</a>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Quality desk</span>
            <h2>Hold us to it.</h2>
            <p>
              Doctors, pharmacies and partners — ask for the documentation
              behind any product. We&rsquo;d rather show you than tell you.
            </p>
          </div>
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Documentation request</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>Product / document of interest</span>
              <span>▾</span>
            </span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Request documentation
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
