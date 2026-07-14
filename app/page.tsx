import SiteHeader from "@/components/site/SiteHeader";
import SiteRuntime from "@/components/home/SiteRuntime";
import { HOME_SECTIONS } from "@/components/home/sections";
import "@/components/home/home.css";
import "@/components/site/inner.css";

// Public home ("/") — the signed-off Phase-3 home, promoted from the
// /preview/home build surface at the commerce-dormant migration beat. Renders
// the human-approved beats verbatim, in comp order. The preview route stays
// (noindex) as the section-build harness; this is the canonical home.
//
// The old storefront that used to live here now mounts only at the flag-gated
// /store route (dormant unless COMMERCE_ENABLED=true) — engine kept in-repo,
// never deleted, per the brief's commerce_model.
export default function Home() {
  const approved = HOME_SECTIONS.filter((s) => s.approved);
  return (
    <div className="hc">
      {/* Pre-paint bridge: SSR markup holds the daylight end-state; when JS is
          on and motion allowed, flag the intro BEFORE first paint so the dawn
          build-up starts from night with no end-state flash. No-JS and
          reduced-motion never get the class and see daylight immediately. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('hc-intro');",
        }}
      />
      <SiteHeader />
      <SiteRuntime />
      {approved.map(({ slug, Component }) => (
        <Component key={slug} />
      ))}
    </div>
  );
}
