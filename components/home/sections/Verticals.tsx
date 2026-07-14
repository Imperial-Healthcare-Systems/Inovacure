// Beat 3 — Verticals grid ("Four ways we deliver health at scale"), built to
// home-C.html + enhanced (staggered card reveal, numeral ink-fill + underline
// micro-interactions). Vertical order and URLs are the frozen IA baseline
// (working/ia-proposal.md); copy is comp-verbatim (content still v0-draft).
const VERTICALS = [
  {
    num: "01",
    title: "Ethical Promotion",
    body: "Transparent, evidence-led promotion of branded formulations to clinicians and pharmacies — building trust rather than pressure.",
    cta: "For doctors",
    href: "/business/ethical-promotion",
  },
  {
    num: "02",
    title: "Nutraceuticals",
    body: "Functional wellness and nutrition products that support everyday health, from paediatric to adult care.",
    cta: "Explore the range",
    href: "/business/nutraceuticals",
  },
  {
    num: "03",
    title: "Active Pharmaceutical Ingredients",
    body: "Reliable API sourcing and supply that underpins consistent, high-quality finished products.",
    cta: "Molecule portfolio",
    href: "/business/apis",
  },
  {
    num: "04",
    title: "Pharma Exports",
    body: "Supplying quality-assured formulations to international markets through compliant, dependable export channels.",
    cta: "Export enquiry",
    href: "/business/pharma-exports",
  },
];

export default function Verticals() {
  return (
    <section className="hc-block">
      <div className="wrap">
        <div className="hc-headrow" data-reveal>
          <div>
            <span className="eyebrow">What we do</span>
            <h2>Four ways we deliver health at scale</h2>
          </div>
          <a className="btn btn-ghost" href="/business">
            Business overview
          </a>
        </div>
        <div className="hc-vgrid">
          {VERTICALS.map((v) => (
            <div className="hc-vcard" key={v.num} data-reveal>
              <span className="hc-num" aria-hidden="true">
                {v.num}
              </span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
              <a href={v.href}>{v.cta} →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
