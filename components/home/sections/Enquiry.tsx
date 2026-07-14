// Beat 7 — enquiry tracks (visual only; capture wiring lands in the dedicated
// enquiry-system beat per phases.md). Three intent-segmented B2B tracks per
// the commerce model (export · distribution · doctors) + WhatsApp line.
// All routes converge on /contact#enquiry until the enquiry system beat
// finalizes per-track routing (human_decides at that beat).
const TRACKS = [
  {
    tag: "International",
    title: "Export enquiry",
    body: "Quality-assured formulations for your market, through compliant export channels.",
    cta: "Start an export enquiry",
  },
  {
    tag: "Distribution",
    title: "Become a distributor",
    body: "Join our growing partner network with dependable supply and honest margins.",
    cta: "Apply for distribution",
  },
  {
    tag: "Clinical",
    title: "For doctors",
    body: "Evidence-led product information and support for your practice and patients.",
    cta: "Talk to our team",
  },
];

export default function Enquiry() {
  return (
    <section className="hc-block hc-enq">
      <div className="wrap">
        <span className="eyebrow" data-reveal>
          Let&rsquo;s work together
        </span>
        <h2 data-reveal>Partner with us for healthier lives.</h2>
        <p
          data-reveal
          style={{ color: "var(--muted)", marginTop: 12, maxWidth: "52ch" }}
        >
          For product enquiries, distribution, exports or partnership —
          we&rsquo;d be glad to hear from you.
        </p>
        <div className="hc-tracks">
          {TRACKS.map((t) => (
            <a className="hc-track" key={t.tag} href="/contact#enquiry" data-reveal>
              <span className="hc-tag">{t.tag}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <span className="hc-go">{t.cta} →</span>
            </a>
          ))}
        </div>
        <p className="hc-wa" data-reveal>
          Prefer chat? <b>WhatsApp us</b> — we respond fast.
        </p>
      </div>
    </section>
  );
}
