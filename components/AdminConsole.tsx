"use client";

import Script from "next/script";
import { SHELL_HTML } from "./shellHtml";

/**
 * Admin console mount for the first-class /admin route.
 *
 * Reuses the storefront prototype's engine verbatim (components/shellHtml +
 * public/engine.js): the same DOM shell is injected so the engine's boot
 * sequence — which writes into storefront nodes (#annBar/#siteMain/#siteFoot)
 * before it routes — has every element it expects. On the /admin pathname the
 * engine resolves straight to the admin view (see onAdminRoute() in engine.js);
 * the storefront subtree stays in the DOM but is never shown.
 *
 * `passHash` is the SHA-256 of the owner password, supplied by the SERVER route
 * from a gitignored env var and published to the engine as
 * window.__ADMIN_PASS_HASH__. The plaintext credential is not in the client
 * bundle. The hash script must run before the engine boots, so it loads
 * beforeInteractive while the engine loads afterInteractive.
 */
export default function AdminConsole({ passHash }: { passHash: string }) {
  return (
    <>
      <Script id="admin-pass-hash" strategy="beforeInteractive">
        {`window.__ADMIN_PASS_HASH__=${JSON.stringify(passHash)};`}
      </Script>
      <div id="inovacure-root" dangerouslySetInnerHTML={{ __html: SHELL_HTML }} />
      <Script src="/engine.js" strategy="afterInteractive" />
    </>
  );
}
