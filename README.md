# Inovacure — Next.js port

A faithful Next.js 15 (App Router + TypeScript) port of the Inovacure
Pharmaceuticals single-file storefront prototype.

## Approach

This is a **faithful mount**, not a rewrite. The original prototype is a complete
client-side commerce app (catalog, cart, checkout, coupons, shopper accounts, and
a password + OTP gated admin console) that stores all state in `localStorage` and
renders itself by writing HTML strings into a static DOM shell.

Rather than re-implement ~2,300 lines of proven logic as React components, the
port keeps that engine intact and wraps it in a real Next.js project:

| Piece | Source in original | Lands as |
| --- | --- | --- |
| `<style>` block | inline `<head>` | [`app/globals.css`](app/globals.css) |
| Inline base64 images | JS consts + seed data | [`public/assets/`](public/assets) (decoded files) |
| Storefront engine (`<script>`) | end of `<body>` | [`public/engine.js`](public/engine.js) |
| Body markup shell | `<body>` … before engine | [`components/shellHtml.ts`](components/shellHtml.ts) |
| `<head>` meta / OG / JSON-LD | `<head>` | [`app/layout.tsx`](app/layout.tsx) |

The shell is injected with `dangerouslySetInnerHTML` so the original inline
`onclick` handlers remain real DOM attributes, and `engine.js` loads as a classic
script (`strategy="afterInteractive"`) so its global functions are defined once the
shell is in the DOM. Behaviour is byte-for-byte identical to the prototype.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Regenerating from the source prototype

The derived artifacts (CSS, images, engine, shell markup) are generated from the
original `../index (14).html` by an extractor. Edit the prototype, then:

```bash
npm run port
```

This rewrites `app/globals.css`, `public/engine.js`, `public/assets/*`, and
`components/shellHtml.ts`. The static scaffolding (layout, page, config) is
hand-authored and left untouched.

## State it's still a prototype

All data lives in `localStorage`; there is no backend. The `// PROD:` markers
throughout `public/engine.js` flag every shortcut (hardcoded admin password,
on-screen OTP, non-cryptographic shopper password hashing, simulated payments)
that must be replaced before production — the natural next step being a
Supabase/Next server-action backend.
