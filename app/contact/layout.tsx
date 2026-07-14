import SiteRuntime from "@/components/home/SiteRuntime";
import "@/components/home/home.css";
import "@/components/site/inner.css";

// Contact page — same inner-page shell as /business.
export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hc">
      <SiteRuntime />
      {children}
    </div>
  );
}
