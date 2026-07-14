import type { Metadata } from "next";
import SiteRuntime from "@/components/home/SiteRuntime";
import "@/components/home/home.css";

// Phase 3 build surface — never indexed; public "/" keeps the old shell until
// the whole-page sign-off + commerce-dormant migration beat swap it over.
export const metadata: Metadata = {
  title: "Preview — Home (Phase 3 build)",
  robots: { index: false, follow: false },
};

export default function PreviewHomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      <SiteRuntime />
      {children}
    </div>
  );
}
