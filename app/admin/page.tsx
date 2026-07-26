import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminConsole from "@/components/AdminConsole";

// First-class admin route — independent of the storefront's COMMERCE_ENABLED
// gate. It has its OWN server-side gate: because sign-in is still a client-side
// comparison (the engine has not been rewritten to real server auth), /admin
// stays 404 in any environment that has not explicitly opted in, exactly like
// /store. Enable it only where an operator works (ADMIN_ENABLED=true), and only
// once a real backend auth exists should this gate be removed.
export const dynamic = "force-dynamic";

// Never indexable, and never linked from any nav/sitemap.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.ADMIN_ENABLED !== "true") notFound();

  // SHA-256 of the owner password, from a gitignored env var. Never the
  // plaintext, and never stored under public/. Published to the engine as
  // window.__ADMIN_PASS_HASH__ by <AdminConsole>. Empty ⇒ sign-in is treated as
  // unconfigured by the engine (it refuses the password step).
  const passHash = process.env.ADMIN_PASS_HASH ?? "";

  return <AdminConsole passHash={passHash} />;
}
