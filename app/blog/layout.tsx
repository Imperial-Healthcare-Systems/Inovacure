import SiteRuntime from "@/components/home/SiteRuntime";
import "@/components/home/home.css";
import "@/components/site/inner.css";
import "@/components/blog/blog.css";
import "@/components/blog/prose.css";

// Blog section — shares the corporate inner-page shell (footer, blocks,
// scroll reveals, header chrome) exactly like the business/about/etc. layouts.
// Motion via the same SiteRuntime; the blog adds `.hc-prose` for long-form
// article typography (the one net-new stylesheet). No dawn intro on inner
// pages. All reveal markup is server-rendered so the once-at-mount runtime
// scan picks it up (the runtime does not re-scan after mount).
export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="hc">
      <SiteRuntime />
      {children}
    </div>
  );
}
