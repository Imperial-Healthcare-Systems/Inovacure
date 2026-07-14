import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Pharma Exports — Inovacure Pharmaceuticals",
  description:
    "Quality-assured formulations for international markets through compliant, dependable export channels. Start an export enquiry with Inovacure.",
};

// Vertical page 04 — Pharma Exports, built TO working/V/comps/exports.html
// (V1-approved archetype). Comp's visible TBC chips replaced with marker-free
// honest phrasing per the human's standing rule (calibration-logged) — facts
// still only go live once the fact sheet confirms them.
export default function PharmaExportsPage() {
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
              <b>Pharma Exports</b>
            </div>
            <span className="hc-kick">Vertical 04 · Pharma Exports</span>
            <h1>Quality-assured formulations, worldwide.</h1>
            <p className="hc-lead">
              Supplying quality-assured formulations to international markets
              through compliant, dependable export channels — one reliable
              point of contact for global health.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras) — blue blister macro melting
            into the band, sliding a little under the text; on mobile it
            follows the text. Swapped for real product photography later */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/blister-packs.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Why Inovacure for your market</span>
            <h2>Built for reach, priced for access.</h2>
            <p>
              Whether you are an international distributor or a formulation
              partner, Inovacure offers a single, reliable point of contact for
              quality-assured pharmaceutical supply.
            </p>
            <p>
              Fair pricing is engineered into every product from the start — so
              affordability travels with quality into your market.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Start an export enquiry
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/lab-bench.jpg"
              alt="Quality-assured manufacturing and testing"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Export readiness
          </span>
          <h2 data-reveal="mask">Proof, not promises.</h2>
          <div className="hc-pgrid">
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/lab-quality.jpg" alt="Quality-control laboratory at work" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✓</span>
              <b>Quality documentation</b>
              <p>
                CoAs, dossiers and quality systems built to international
                standards — the certification wall goes live here exactly as
                documents are confirmed.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/blisters-multi.jpg" alt="Finished blister-packed formulations" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">⇄</span>
              <b>Compliant channels</b>
              <p>
                Documentation-first export process: dossiers, CoAs and
                regulatory paperwork handled through dependable, compliant
                channels.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/consult-at-screen.jpg" alt="Export desk team reviewing product documentation" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">◎</span>
              <b>Dedicated export desk</b>
              <p>
                A single named contact for your market — from first enquiry to
                repeat supply. Direct route: export enquiry form or WhatsApp.
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
            <span className="eyebrow">Markets</span>
            <h2>Growing market by market — honestly.</h2>
            <p>
              We name markets as registrations land, not before. The map lights
              up with every country we enter; ask the export desk where we
              stand today.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Ask about your market
            </a>
          </div>
          {/* human-directed (2026-07-14): no animated map — the moment is a
              play on light: the words themselves light up over a calm aurora */}
          <div className="hc-glowfield" data-reveal>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <i aria-hidden="true"></i>
            <div className="hc-lightup">
              <b>
                New markets, <em>lighting&nbsp;up.</em>
              </b>
              <small>
                Country by country, as export registrations are confirmed.
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
          <h2 data-reveal="mask">From enquiry to supply in four steps.</h2>
          <div className="hc-steps">
            <span className="hc-stepline" data-drawline aria-hidden="true"></span>
            <div className="hc-step" data-reveal>
              <b>Enquire</b>
              <p>
                Tell us your market, products of interest and volumes — form,
                email or WhatsApp.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Documentation</b>
              <p>
                We share product information, CoAs and dossier readiness for
                your regulatory pathway.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Registration &amp; terms</b>
              <p>
                We support your registration process and agree supply terms
                built on honest pricing.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Dependable supply</b>
              <p>
                Quality-assured production and dispatch — one point of contact,
                every reorder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">Export desk</span>
            <h2>Bring Inovacure to your market.</h2>
            <p>
              For export enquiries, distribution rights and product
              documentation — we&rsquo;d be glad to hear from you.
            </p>
          </div>
          {/* visual mock per comp — the live form lands in the enquiry-system
              beat; until then the whole card routes to the contact page */}
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>Export enquiry</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>Country / market</span>
              <span>▾</span>
            </span>
            <span className="hc-mf sel">
              <span>Products / molecules of interest</span>
              <span>▾</span>
            </span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Send export enquiry
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
