"use client";

// Catalog browser — dual-axis filter (segment × dosage form) + range + text
// search, per the V1 catalog comp. Chips are COMPUTED from the data so the
// taxonomy can never show an empty node (brief constraint). No prices (open
// decision) — cards carry pack size + enquire, the sector norm.
import { useMemo, useState } from "react";
import { PRODUCTS } from "./products";

const uniq = (xs: string[]) => Array.from(new Set(xs));

export default function CatalogBrowser() {
  const [seg, setSeg] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [range, setRange] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const segs = uniq(PRODUCTS.map((p) => p.segment));
  const forms = uniq(PRODUCTS.map((p) => p.form));
  const ranges = uniq(PRODUCTS.map((p) => p.range));

  const shown = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (!seg || p.segment === seg) &&
          (!form || p.form === form) &&
          (!range || p.range === range) &&
          (!q ||
            (p.name + " " + p.brand + " " + p.blurb)
              .toLowerCase()
              .includes(q.toLowerCase())),
      ),
    [seg, form, range, q],
  );

  return (
    <>
      <div className="hc-toolbar">
        <div className="wrap">
          <div className="hc-fgroup">
            <span className="hc-flbl">Segment</span>
            <button
              className={`hc-chip${seg === null ? " on" : ""}`}
              onClick={() => setSeg(null)}
            >
              All
            </button>
            {segs.map((s) => (
              <button
                key={s}
                className={`hc-chip${seg === s ? " on" : ""}`}
                onClick={() => setSeg(seg === s ? null : s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="hc-fgroup">
            <span className="hc-flbl">Form</span>
            {forms.map((f) => (
              <button
                key={f}
                className={`hc-chip grn${form === f ? " on" : ""}`}
                onClick={() => setForm(form === f ? null : f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="hc-fgroup">
            <span className="hc-flbl">Range</span>
            {ranges.map((r) => (
              <button
                key={r}
                className={`hc-chip${range === r ? " on" : ""}`}
                onClick={() => setRange(range === r ? null : r)}
              >
                {r}
              </button>
            ))}
          </div>
          <label className="hc-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search products…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>
      </div>

      <section className="hc-block">
        <div className="wrap">
          <p className="hc-count">
            <b>
              {shown.length} product{shown.length === 1 ? "" : "s"}
            </b>{" "}
            · first-launch range — the catalog grows with every launch
          </p>
          <div className="hc-pcatgrid">
            {shown.map((p) => (
              <a key={p.slug} className="hc-pcard" href={`/products/${p.slug}`}>
                <div className="hc-pph">
                  {p.badge && <span className="hc-pbadge">{p.badge}</span>}
                  <img src={p.logo} alt={p.brand} loading="lazy" />
                </div>
                <div className="hc-pbd">
                  <span className="hc-pseg">
                    {p.segment} · {p.form}
                  </span>
                  <h3>{p.name}</h3>
                  <p className="hc-pmeta">{p.blurb}</p>
                  <div className="hc-pfoot">
                    <span className="hc-ppack">{p.pack}</span>
                    <span className="hc-penq">View & enquire →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {shown.length === 0 && (
            <p className="hc-empty">
              Nothing matches that combination yet — the range is growing.{" "}
              <a href="/contact#enquiry">Ask us what&rsquo;s coming</a>.
            </p>
          )}
          <div className="hc-notebar" data-reveal>
            <b>A young catalog, honestly shown.</b> These are our first-launch
            products — new formulations and segments join as they are
            confirmed. Looking for something specific?{" "}
            <a href="/contact#enquiry">Ask the product desk</a>.
          </div>
        </div>
      </section>
    </>
  );
}
