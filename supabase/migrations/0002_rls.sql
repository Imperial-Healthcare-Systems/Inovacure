-- ============================================================================
-- Row-Level Security. Every table has RLS enabled; access is least-privilege.
-- The service-role key (server-only) bypasses all of this and is used by trusted
-- server actions (checkout, enquiry capture, admin mutations). These policies
-- govern the anon/authenticated paths only.
-- ============================================================================

-- Defined here (not in 0001) because it reads public.staff, which must already
-- exist. security definer so it can read staff regardless of the caller's RLS.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff s where s.user_id = auth.uid() and s.active);
$$;

alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_reviews  enable row level security;
alter table public.customers        enable row level security;
alter table public.addresses        enable row level security;
alter table public.coupons          enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.order_events     enable row level security;
alter table public.returns          enable row level security;
alter table public.carts            enable row level security;
alter table public.cart_items       enable row level security;
alter table public.staff            enable row level security;
alter table public.audit_log        enable row level security;
alter table public.kv_settings      enable row level security;
alter table public.enquiries        enable row level security;

-- ── Public catalog: readable by anyone; writable by staff only ──────────────
create policy "categories read"  on public.categories       for select using (true);
create policy "categories write" on public.categories       for all    using (public.is_staff()) with check (public.is_staff());

create policy "products read"    on public.products         for select using (active or public.is_staff());
create policy "products write"   on public.products         for all    using (public.is_staff()) with check (public.is_staff());

create policy "variants read"    on public.product_variants for select using (true);
create policy "variants write"   on public.product_variants for all    using (public.is_staff()) with check (public.is_staff());

create policy "reviews read"     on public.product_reviews  for select using (approved or public.is_staff());
create policy "reviews insert"   on public.product_reviews  for insert with check (true);   -- shoppers may submit (moderated by `approved`)
create policy "reviews manage"   on public.product_reviews  for update using (public.is_staff()) with check (public.is_staff());
create policy "reviews delete"   on public.product_reviews  for delete using (public.is_staff());

-- ── Coupons: NOT publicly listable (codes are secret); staff manage. Validation
--    of a code at checkout runs server-side via the service role. ─────────────
create policy "coupons staff" on public.coupons for all using (public.is_staff()) with check (public.is_staff());

-- ── Customer-owned data: a signed-in shopper sees/edits only their own rows;
--    staff can read all. ───────────────────────────────────────────────────
create policy "customers self"   on public.customers for all
  using (id = auth.uid() or public.is_staff()) with check (id = auth.uid());

create policy "addresses self"   on public.addresses for all
  using (customer_id = auth.uid() or public.is_staff()) with check (customer_id = auth.uid());

create policy "orders read own"  on public.orders for select
  using (customer_id = auth.uid() or public.is_staff());
create policy "orders staff mut" on public.orders for update using (public.is_staff()) with check (public.is_staff());

create policy "order_items read" on public.order_items for select
  using (public.is_staff() or exists (
    select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

create policy "order_events read" on public.order_events for select
  using (public.is_staff() or exists (
    select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

create policy "returns own"      on public.returns for select
  using (customer_id = auth.uid() or public.is_staff());
create policy "returns insert"   on public.returns for insert with check (customer_id = auth.uid());
create policy "returns staff"    on public.returns for update using (public.is_staff()) with check (public.is_staff());

create policy "carts self"       on public.carts for all
  using (customer_id = auth.uid() or public.is_staff()) with check (customer_id = auth.uid());
create policy "cart_items self"  on public.cart_items for all
  using (public.is_staff() or exists (
    select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()))
  with check (exists (
    select 1 from public.carts c where c.id = cart_id and c.customer_id = auth.uid()));

-- ── Admin: staff & audit visible to staff only ──────────────────────────────
create policy "staff read"  on public.staff     for select using (public.is_staff());
create policy "staff manage" on public.staff    for all    using (public.is_staff()) with check (public.is_staff());
create policy "audit staff" on public.audit_log for select using (public.is_staff());

-- ── CMS: the 'cms' row is public-readable (drives storefront copy); everything
--    else (settings, invoice_seq) is staff-only. Writes are staff-only. ──────
create policy "cms public read" on public.kv_settings for select using (key = 'cms' or public.is_staff());
create policy "cms staff write" on public.kv_settings for all    using (public.is_staff()) with check (public.is_staff());

-- ── Enquiries: anyone may submit; only staff may read/triage ────────────────
create policy "enquiries insert" on public.enquiries for insert with check (true);
create policy "enquiries staff"  on public.enquiries for select using (public.is_staff());
create policy "enquiries triage" on public.enquiries for update using (public.is_staff()) with check (public.is_staff());
