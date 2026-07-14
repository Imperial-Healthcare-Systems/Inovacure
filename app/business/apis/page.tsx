import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";

export const metadata: Metadata = {
  title: "Active Pharmaceutical Ingredients — Inovacure Pharmaceuticals",
  description:
    "Reliable API sourcing and supply that underpins consistent, high-quality finished products. Request the current molecule list from Inovacure.",
};

// Vertical page 03 — APIs. Adapts the human-signed enhanced archetype. The
// molecule table ships in its honest state: real structure, skeleton rows —
// no invented molecules; the list goes live from the fact sheet / confirmed
// supply agreements. Copy grounded in working/C/company-profile-source.md.
export default function ApisPage() {
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
              <b>APIs</b>
            </div>
            <span className="hc-kick">
              Vertical 03 · Active Pharmaceutical Ingredients
            </span>
            <h1>The ingredient you rely on.</h1>
            <p className="hc-lead">
              Reliable API sourcing and supply that underpins consistent,
              high-quality finished products — for manufacturers who cannot
              afford surprises.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras b2) — well-plate macro: precise,
            technical, reads as chemistry at a glance */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img src="/assets/imagery/lab-wellplate.jpg" alt="" />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap hc-vintro">
          <div data-reveal>
            <span className="eyebrow">Why source through Inovacure</span>
            <h2>Consistency is the product.</h2>
            <p>
              A finished formulation is only as dependable as the ingredient
              inside it. We source and supply APIs with the documentation,
              consistency and honest pricing that let your quality system
              trust ours.
            </p>
            <p>
              One reliable point of contact — from first specification to
              every repeat consignment.
            </p>
            <a className="btn btn-primary" style={{ marginTop: 8 }} href="/contact#enquiry">
              Start an API enquiry
            </a>
          </div>
          <div className="hc-vimg" data-reveal>
            <img
              src="/assets/imagery/lab-pipette.jpg"
              alt="Precision handling in the laboratory"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Sourcing &amp; supply
          </span>
          <h2 data-reveal="mask">Built for your quality system.</h2>
          <div className="hc-pgrid">
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/docs-desk.jpg" alt="Documentation desk at work" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">☰</span>
              <b>Documentation-first</b>
              <p>
                CoAs and quality documentation move with every consignment —
                stated plainly, shared before you commit.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/facility-supply.jpg" alt="Supply and logistics" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">⇄</span>
              <b>Dependable supply</b>
              <p>
                Sourcing built around continuity — consistent grades,
                consistent timelines, every reorder.
              </p>
            </div>
            <div className="hc-pc" data-reveal>
              <figure className="hc-pcimg">
                <img src="/assets/imagery/blisters-flatlay.jpg" alt="Finished formulations" loading="lazy" />
              </figure>
              <span className="hc-ic" aria-hidden="true">✚</span>
              <b>From API to finished form</b>
              <p>
                We manufacture formulations ourselves — so we hold the APIs we
                supply to the same bar we hold our own products.
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
            <span className="eyebrow">Molecule list</span>
            <h2>Published as agreements are confirmed.</h2>
            <p>
              We list molecules the same way we name export markets — once
              they are real. The current list, grades and documentation are
              one enquiry away.
            </p>
            <a className="btn btn-green" style={{ marginTop: 18 }} href="/contact#enquiry">
              Request the molecule list
            </a>
          </div>
          {/* honest-state molecule table: real structure, skeleton rows — no
              invented molecules; rows go live from the fact sheet */}
          <div className="hc-moltable" data-reveal aria-label="Molecule list — available on request">
            <div className="hc-molhead">
              <span>Molecule</span>
              <span>Segment</span>
              <span>Grade / form</span>
              <span>Docs</span>
            </div>
            <div className="hc-molrow" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>
            <div className="hc-molrow" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>
            <div className="hc-molrow" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>
            <div className="hc-molnote">
              Current list available on request —{" "}
              <a href="/contact#enquiry">ask the API desk</a>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-how">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            How it works
          </span>
          <h2 data-reveal="mask">From specification to consignment.</h2>
          <div className="hc-steps">
            <span className="hc-stepline" data-drawline aria-hidden="true"></span>
            <div className="hc-step" data-reveal>
              <b>Specify</b>
              <p>
                Share the molecule, grade and volumes you need — form, email
                or WhatsApp.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Review documentation</b>
              <p>
                CoAs and quality documentation for your evaluation, before any
                commitment.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Agree terms</b>
              <p>
                Supply terms built on honest pricing — volumes, timelines and
                continuity, stated plainly.
              </p>
            </div>
            <div className="hc-step" data-reveal>
              <b>Receive &amp; repeat</b>
              <p>
                Consistent consignments with documentation attached — one
                named contact, every reorder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-enqband">
        <div className="wrap">
          <div data-reveal>
            <span className="eyebrow">API desk</span>
            <h2>Source your next API with us.</h2>
            <p>
              For the molecule list, specifications and supply terms —
              we&rsquo;d be glad to hear from you.
            </p>
          </div>
          {/* visual mock per archetype — live form lands in the
              enquiry-system beat; the card routes to contact until then */}
          <a className="hc-mockform" href="/contact#enquiry" data-reveal>
            <b>API enquiry</b>
            <span className="hc-mf">Name · Organisation</span>
            <span className="hc-mf">Email · Phone / WhatsApp</span>
            <span className="hc-mf sel">
              <span>Molecule(s) of interest</span>
              <span>▾</span>
            </span>
            <span className="hc-mf sel">
              <span>Volumes / timeline</span>
              <span>▾</span>
            </span>
            <span className="hc-mf" style={{ height: 74 }}>
              Message
            </span>
            <span className="btn btn-primary btn-block" style={{ justifyContent: "center" }}>
              Send API enquiry
            </span>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
