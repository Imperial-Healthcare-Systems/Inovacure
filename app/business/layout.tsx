import SiteRuntime from "@/components/home/SiteRuntime";
import "@/components/home/home.css";
import "@/components/site/inner.css";

// Business vertical pages — shares the home shell styles (footer, blocks,
// reveals) + the inner-page chrome. Motion via the same SiteRuntime (scroll
// reveals, counters, band parallax); no dawn intro on inner pages.
export default function BusinessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hc">
      <SiteRuntime />
      {children}
    </div>
  );
}
