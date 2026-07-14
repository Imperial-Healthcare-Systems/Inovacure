import SiteRuntime from "@/components/home/SiteRuntime";
import "@/components/home/home.css";
import "@/components/site/inner.css";

// Quality page — same inner-page shell as /business.
export default function QualityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hc">
      <SiteRuntime />
      {children}
    </div>
  );
}
