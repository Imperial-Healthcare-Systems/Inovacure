// Beat 5 — therapeutic reach ("Live today. Expanding tomorrow."), built to
// home-C.html + enhanced (count-up counters on scroll, staggered tiles, hover
// wake-up on EXPANDING tiles). Counter values are honest derived numbers from
// the approved comp — no invented stats (rules.md §3). Segment icons are
// code-drawn brand-colored SVGs (kept fallback-art pattern).
const TILES: { name: string; live: boolean; icon: React.ReactNode }[] = [
  {
    name: "Ophthalmology",
    live: true,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="34" fill="none" stroke="#004497" strokeWidth="8" />
        <circle cx="60" cy="60" r="14" fill="#4f8a37" />
      </svg>
    ),
  },
  {
    name: "Paediatric nutrition",
    live: true,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 26 C42 52 38 64 60 82 C82 64 78 52 60 26Z" fill="#1668c4" />
      </svg>
    ),
  },
  {
    name: "Cardiology",
    live: false,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 88 C30 66 24 44 40 34c10-6 18 0 20 8 2-8 10-14 20-8 16 10 10 32-20 54Z"
          fill="#004497"
        />
      </svg>
    ),
  },
  {
    name: "Orthopaedics",
    live: false,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="52" y="24" width="16" height="72" rx="8" fill="#1668c4" />
        <circle cx="60" cy="30" r="14" fill="#004497" />
        <circle cx="60" cy="90" r="14" fill="#004497" />
      </svg>
    ),
  },
  {
    name: "Diabetology",
    live: false,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 24v72M36 48h48M42 78h36"
          stroke="#004497"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    name: "Dermatology",
    live: false,
    icon: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="30" fill="#e8f1ea" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#58963d" strokeWidth="8" />
      </svg>
    ),
  },
];

const COUNTERS = [
  { value: "4", label: "business verticals" },
  { value: "2", label: "segments live" },
  { value: "4+", label: "segments expanding" },
  { value: "1", label: "promise — Live Healthy" },
];

export default function Reach() {
  return (
    <section className="hc-block hc-reach">
      <div className="wrap">
        <div className="hc-rgrid">
          <div data-reveal>
            <span className="eyebrow">Therapeutic reach</span>
            <h2 style={{ margin: "10px 0 16px" }}>Live today. Expanding tomorrow.</h2>
            <p style={{ color: "var(--muted)", maxWidth: "46ch" }}>
              Our portfolio serves eye care &amp; vision wellness and paediatric
              nutrition today — and is expanding across cardiology,
              orthopaedics, diabetology and dermatology. Browse the growing
              range in our product catalog.
            </p>
            <div className="hc-counters">
              {COUNTERS.map((c) => (
                <div key={c.label}>
                  <b data-counter>{c.value}</b>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <a className="btn btn-primary" href="/products">
                Browse products
              </a>
            </div>
          </div>
          <div className="hc-tiles">
            {TILES.map((t) => (
              <div key={t.name} className={`hc-tile ${t.live ? "live" : "soon"}`} data-reveal>
                {t.icon}
                <b>{t.name}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
