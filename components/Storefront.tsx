"use client";

import Script from "next/script";
import { SHELL_HTML } from "./shellHtml";

/**
 * Faithful mount of the Inovacure storefront prototype.
 *
 * The original single-file app renders itself by writing HTML strings into a
 * static DOM shell and wiring behaviour through global functions referenced by
 * inline `onclick` attributes. We preserve that engine verbatim:
 *   - The markup shell is injected via dangerouslySetInnerHTML so the inline
 *     handlers stay real DOM attributes (React never diffs this subtree).
 *   - The engine (public/engine.js) loads as a classic script after hydration,
 *     defining the globals and calling boot() once the shell is in the DOM.
 */
export default function Storefront() {
  return (
    <>
      <div id="inovacure-root" dangerouslySetInnerHTML={{ __html: SHELL_HTML }} />
      <Script src="/engine.js" strategy="afterInteractive" />
    </>
  );
}
