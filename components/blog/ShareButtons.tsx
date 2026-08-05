"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/blog/track";
import { postUrl } from "@/lib/blog/config";

// Share row — Web Share API where available, plus copy-link and the networks
// the brand already uses (WhatsApp is a primary channel across the site).
export default function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const url = postUrl(slug);
  const [copied, setCopied] = useState(false);
  // Detect the Web Share API only AFTER mount. Gating the native-share button on
  // `navigator` during render makes the server HTML (no navigator → no button)
  // differ from the client's, which trips a hydration mismatch. Starting false on
  // both sides keeps the first render identical; the button reveals post-mount.
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const native = async () => {
    track("share_click", { method: "native", slug });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed */
      }
    }
  };

  const copy = async () => {
    track("share_click", { method: "copy", slug });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const enc = encodeURIComponent;
  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
  ];

  return (
    <div className="hc-share" aria-label="Share this article">
      <span className="hc-share-label">Share</span>
      {canNativeShare && (
        <button type="button" className="hc-share-btn" onClick={native}>
          Share…
        </button>
      )}
      {links.map((l) => (
        <a
          key={l.label}
          className="hc-share-btn"
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share_click", { method: l.label.toLowerCase(), slug })}
        >
          {l.label}
        </a>
      ))}
      <button type="button" className="hc-share-btn" onClick={copy}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
