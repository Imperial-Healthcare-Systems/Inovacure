// Beat 2 (rev 2, human-directed 2026-07-14) — the TBC-marked certification
// names read badly to customers, so the strip now carries brand-promise
// statements grounded in the client's own approved profile copy (no
// certifiable claims -> no TBC markers needed; rules.md §3 intact). The named
// certifications (WHO-GMP / FSSAI / DCGI) move back in once the fact sheet
// confirms them. Ticker drift at all widths; RM fallback = native scroll row.
const STANDARDS = [
  "Quality-assured formulations",
  "Tested for efficacy & potency",
  "Affordable by design",
  "Ethical by default",
  "Access for all",
];

function StandardSet({ hidden }: { hidden?: boolean }) {
  return (
    <>
      {STANDARDS.map((name) => (
        // no data-reveal: a marquee must be fully present on first paint —
        // scroll-gating left originals hidden while duplicates drifted through
        <span
          key={name}
          className={hidden ? "hc-certdup" : undefined}
          aria-hidden={hidden || undefined}
        >
          <i></i>
          {name}
        </span>
      ))}
    </>
  );
}

export default function Certs() {
  return (
    <div className="hc-certs">
      <div className="wrap">
        <span className="hc-lbl">The Inovacure standard</span>
        <div className="hc-certbelt">
          <div className="hc-certtrack">
            <StandardSet />
            {/* duplicate set: makes the -50% drift loop seamless */}
            <StandardSet hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
