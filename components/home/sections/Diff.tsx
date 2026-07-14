// Beat 6 — differentiators + vision quote (dark band), built to home-C.html +
// enhanced (starfield echo of the hero's night sky — repetition-as-identity;
// staggered cards; oversized decorative quote mark). Copy comp-verbatim; the
// quote is client-authored (profile PDF vision statement).
const DIFFS = [
  {
    title: "Affordability without compromise",
    body: "Fair pricing engineered into the product from the start — cost is never a barrier to the right treatment.",
  },
  {
    title: "Quality you can verify",
    body: "Products tested for efficacy and potency, held to strict standards for safety and effectiveness.",
  },
  {
    title: "Ethical by default",
    body: "Honest, evidence-based promotion and responsible conduct across every relationship.",
  },
  {
    title: "Built for reach",
    body: "Domestic promotion, nutraceuticals, API supply and exports under one dependable partner.",
  },
];

export default function Diff() {
  return (
    <section className="hc-block hc-diff">
      <div className="hc-stars hc-diffstars" aria-hidden="true">
        <i></i>
        <i></i>
      </div>
      <div className="wrap">
        <span className="eyebrow" data-reveal>
          Our difference
        </span>
        <h2 data-reveal>Why partners choose Inovacure</h2>
        <div className="hc-dgrid">
          {DIFFS.map((d) => (
            <div className="hc-dcard" key={d.title} data-reveal>
              <b>{d.title}</b>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
        <div className="hc-dquote">
          <blockquote data-reveal>
            &ldquo;Quality healthcare should remain accessible to individuals
            irrespective of their economic circumstances.&rdquo;
            <cite>— The Inovacure vision</cite>
          </blockquote>
          {/* PLACEHOLDER imagery (client rule 2026-07-13): stock stand-in,
              human-picked candidate #4 (2026-07-14) — tracked in
              working/V/asset-manifest.yaml (stock-extras), replaced with real
              photography later */}
          <figure className="hc-dphoto" data-reveal>
            <img
              src="/assets/imagery/held-hands-care.jpg"
              alt="Hands held in care and support"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
