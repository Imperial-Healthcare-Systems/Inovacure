import { notFound } from "next/navigation";
import Storefront from "@/components/Storefront";

// DORMANT commerce surface (brief: commerce_model.dormant). The full
// storefront + admin engine (components/Storefront + shellHtml + engine.js)
// stays in the repo but is unreachable in public — this route 404s unless the
// client flips COMMERCE_ENABLED=true at build time, which is the intended
// switch-on when the nutraceutical OTC line activates. Nothing here is
// deleted or refactored; the engine boots verbatim when re-enabled.
export const dynamic = "force-static";

export default function StorePage() {
  if (process.env.COMMERCE_ENABLED !== "true") notFound();
  return <Storefront />;
}
