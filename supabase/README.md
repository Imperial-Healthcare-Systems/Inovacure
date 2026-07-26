# Inovacure — database (Supabase)

The site is moving from a backend-less prototype (markdown blog + **localStorage**
admin/storefront in `public/engine.js`) onto **Supabase Postgres**, driven from
Next server actions. This folder holds the schema; the app code lives under
`lib/supabase/*` (clients), `lib/db/*` (typed data access) and `lib/actions/*`
(server actions).

> The **blog stays file-based** (`content/blog/*.md`). Only the *dynamic* data
> (commerce, customers, orders, admin/RBAC, CMS copy, enquiries) moves to the DB.

## What exists now (Phase 1 — foundation)

- **Full schema** for every dynamic subsystem — `migrations/0001_schema.sql`:
  categories, products, product_variants, product_reviews, customers, addresses,
  coupons, orders, order_items, order_events, returns, carts, cart_items, staff,
  audit_log, kv_settings (CMS/settings), enquiries. Plus a `product_list` view
  (derived price/stock) and an `is_staff()` helper.
- **RLS policies** — `migrations/0002_rls.sql`: public read of catalog + the
  `cms` row; owner-scoped customer data; staff-gated admin data; anonymous
  enquiry submits.
- **Seed** — `migrations/0003_seed.sql`: demo catalog, coupons, CMS/settings,
  owner staff row (mirrors the engine's seed).
- **Clients** — `lib/supabase/{client,server,admin}.ts` (browser / SSR /
  service-role), all guarded so the app builds and runs **before** credentials
  exist.
- **One live slice** — the public enquiry form (`components/site/EnquiryPanel.tsx`
  → `lib/actions/enquiry.ts` → `enquiries` table). Until the DB is configured it
  falls back to composing an email, so it always works.

Everything degrades gracefully: with no env set, `pnpm build` and `pnpm dev`
succeed and DB-backed features show empty/fallback states.

## First-time setup

1. Create a project at <https://supabase.com/dashboard> (free tier is fine).
2. **Project Settings → API** — copy into `.env.local` (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(server-only — never expose, never in `public/`)*
3. Run the migrations **in order** (SQL Editor, or the Supabase CLI):
   ```
   0001_schema.sql → 0002_rls.sql → 0003_seed.sql
   ```
4. Regenerate the authoritative types (replaces the hand-authored stand-in):
   ```
   SUPABASE_PROJECT_ID=<ref> pnpm db:types
   ```
5. Restart `pnpm dev`. Submit the contact form → a row appears in `enquiries`.

## Auth model (important)

- **Shoppers** use Supabase Auth; their profile is `customers` (1:1 with
  `auth.users`), and RLS limits them to their own orders/addresses/returns.
- **Staff/admin**: a row in `staff` linked to an `auth.users` id via `user_id`.
  `is_staff()` drives every admin policy. The current `/admin` console still uses
  the client-side password gate — that is **not** real auth and must be replaced
  with Supabase Auth + the `staff` table before the admin writes to the DB.
- The **service-role key** bypasses RLS and is used only by trusted server
  actions (checkout, enquiry capture, admin mutations).

## Phased roadmap

| Phase | Scope | Status |
|---|---|---|
| **1. Foundation** | Schema + RLS + seed + clients + types + enquiry slice | ✅ done (this change) |
| **2. Catalog reads** | `/products` + `/store` read from `product_list`/`products` (helpers in `lib/db/catalog.ts` are ready) | next |
| **3. Auth** | Supabase Auth for shoppers; `staff`-based auth to replace the `/admin` password gate | next |
| **4. Commerce writes** | Cart → checkout → `orders`/`order_items` (server action, service role); coupons validated server-side | after 2–3 |
| **5. Fresh admin** | New DB-backed admin (orders, inventory, customers, coupons, returns, CMS, audit) replacing the localStorage console | after 4 |

Nothing here provisions or migrates a live database automatically — create the
project, add the keys, and run the SQL above.
