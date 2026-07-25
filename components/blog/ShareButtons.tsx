"use client";

import { useState } from "react";
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
      {typeof navigator !== "undefined" && "share" in navigator && (
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
