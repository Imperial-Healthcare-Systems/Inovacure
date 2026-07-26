-- ============================================================================
-- Inovacure — core schema (all dynamic subsystems)
-- Run order: 0001_schema.sql → 0002_rls.sql → 0003_seed.sql
-- Mirrors the shapes the app already uses (public/engine.js state + the public
-- catalog), so the localStorage prototype can be retired onto a real backend.
-- ============================================================================

-- gen_random_uuid() is built in on Supabase (pg13+). No extension needed.

-- ── Enums ───────────────────────────────────────────────────────────────────
create type staff_role     as enum ('owner','manager','fulfilment','support','finance','readonly');
create type order_status   as enum ('payment_pending','processing','paid','packed','shipped','delivered','cancelled','returned');
create type coupon_type    as enum ('pct','flat');
create type product_range  as enum ('ethical','nutraceutical');
create type enquiry_track  as enum ('export','distributor','doctor','general');
create type enquiry_status as enum ('new','in_progress','closed');
create type return_status  as enum ('requested','approved','rejected','received','refunded');

-- ── Shared helpers ──────────────────────────────────────────────────────────
-- (public.is_staff() is defined in 0002_rls.sql, AFTER the staff table exists —
--  a SQL function is validated at creation time, so it can't reference staff yet.)
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ── Catalog ─────────────────────────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  seo        text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  segment      text,
  base_sku     text,
  badge        text,
  tax_rate     numeric(5,2)  not null default 12,
  tax_code     text,
  short_desc   text,
  features     jsonb not null default '[]'::jsonb,          -- string[]
  rating       numeric(2,1)  not null default 4.6,
  review_count int  not null default 0,
  icon         text,
  bg           text,
  image        text,
  content      jsonb not null default '{}'::jsonb,          -- {origin,ingredients,usage,certifications,shelf_life,net_weight}
  faqs         jsonb not null default '[]'::jsonb,          -- {q,a}[]
  range        product_range,
  category_id  uuid references public.categories(id) on delete set null,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index products_category_idx on public.products(category_id);
create index products_active_idx   on public.products(active);
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- Top-level price/mrp/stock are DERIVED from variants (never authored) — see the
-- product_list view below; the app kept the same invariant in engine.js.
create table public.product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label      text not null,
  sku        text not null unique,
  price      numeric(10,2) not null default 0,
  mrp        numeric(10,2) not null default 0,
  stock      int  not null default 0,
  sort_order int  not null default 0
);
create index product_variants_product_idx on public.product_variants(product_id);

create table public.product_reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name       text not null,
  rating     int  not null check (rating between 1 and 5),
  text       text,
  approved   boolean not null default true,
  created_at timestamptz not null default now()
);
create index product_reviews_product_idx on public.product_reviews(product_id);

-- Convenience read model: product + derived cheapest price / total stock.
create view public.product_list as
  select
    p.*,
    coalesce((select min(v.price) from public.product_variants v
              where v.product_id = p.id and v.stock > 0), 0) as price,
    coalesce((select min(v.mrp) from public.product_variants v
              where v.product_id = p.id and v.stock > 0), 0) as mrp,
    coalesce((select sum(v.stock) from public.product_variants v
              where v.product_id = p.id), 0) as stock
  from public.products p;

-- ── Customers & auth-linked profiles ────────────────────────────────────────
create table public.customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name        text, line1 text, line2 text,
  city        text, state text, pincode text, phone text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index addresses_customer_idx on public.addresses(customer_id);

-- ── Promotions ──────────────────────────────────────────────────────────────
create table public.coupons (
  code        text primary key,
  type        coupon_type not null,
  value       numeric(10,2) not null,
  description text,
  active      boolean not null default true,
  uses        int not null default 0,
  cap         int not null default 0,          -- 0 = unlimited
  min_cart    numeric(10,2) not null default 0,
  expires_at  date
);

-- ── Orders ──────────────────────────────────────────────────────────────────
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  customer_id      uuid references public.customers(id) on delete set null,
  email            text,
  phone            text,
  status           order_status not null default 'payment_pending',
  subtotal         numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  tax              numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  coupon_code      text references public.coupons(code) on delete set null,
  payment_method   text,
  shipping_address jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index orders_customer_idx on public.orders(customer_id);
create index orders_status_idx   on public.orders(status);
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

create table public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  variant_sku text,
  name        text,
  label       text,
  unit_price  numeric(10,2) not null default 0,
  qty         int not null default 1,
  tax_rate    numeric(5,2) not null default 0
);
create index order_items_order_idx on public.order_items(order_id);

create table public.order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  label      text not null,
  actor      text,
  created_at timestamptz not null default now()
);
create index order_events_order_idx on public.order_events(order_id);

create table public.returns (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  reason      text,
  status      return_status not null default 'requested',
  items       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger returns_touch before update on public.returns
  for each row execute function public.touch_updated_at();

-- ── Carts (optional server-side cart; storefront may keep client cart) ───────
create table public.carts (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create table public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references public.carts(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  variant_sku text,
  qty         int not null default 1
);
create index cart_items_cart_idx on public.cart_items(cart_id);

-- ── Admin: staff / RBAC / audit ─────────────────────────────────────────────
create table public.staff (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users(id) on delete set null,
  name       text not null,
  email      text not null unique,
  role       staff_role not null default 'readonly',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor      text,
  action     text not null,
  entity     text,
  detail     text,
  created_at timestamptz not null default now()
);
create index audit_log_created_idx on public.audit_log(created_at desc);

-- ── CMS / settings singletons (mirrors engine dbLoad('cms'|'settings')) ─────
create table public.kv_settings (
  key        text primary key,     -- 'cms' | 'settings' | 'invoice_seq'
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger kv_settings_touch before update on public.kv_settings
  for each row execute function public.touch_updated_at();

-- ── Enquiries (public contact form capture) ─────────────────────────────────
create table public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  track        enquiry_track  not null default 'general',
  name         text not null,
  organisation text,
  email        text,
  phone        text,
  message      text not null,
  status       enquiry_status not null default 'new',
  source       text not null default 'website',
  created_at   timestamptz not null default now()
);
create index enquiries_created_idx on public.enquiries(created_at desc);
create index enquiries_status_idx  on public.enquiries(status);
