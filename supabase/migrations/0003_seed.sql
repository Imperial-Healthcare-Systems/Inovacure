-- ============================================================================
-- Seed data — mirrors public/engine.js SEED_* so the DB-backed storefront/admin
-- starts populated. Idempotent-ish: uses stable slugs/codes with ON CONFLICT.
-- Extend with the full catalog as the fact sheet confirms products.
-- ============================================================================

-- ── Categories ──────────────────────────────────────────────────────────────
insert into public.categories (name, slug, seo, sort_order) values
  ('Eye Drops',           'eye-drops',           'Lubricating & dry-eye relief drops for daily comfort.', 1),
  ('Vision Supplements',  'vision-supplements',  'Omega-3, Lutein & multivitamins that support macular and vision health.', 2),
  ('Contact Lens Care',   'contact-lens-care',   'Multi-purpose solutions and cleansers for all contact lenses.', 3),
  ('Eye Hygiene',         'eye-hygiene',         'Eyelid wipes and gentle cleansers for clean, refreshed eyes.', 4),
  ('Kids',                'kids',                'Tasty, nutritious gummies and supplements made for children.', 5)
on conflict (slug) do nothing;

-- ── Products (+ variants, reviews) ──────────────────────────────────────────
with cat as (select id, slug from public.categories)
insert into public.products (slug, name, segment, base_sku, badge, tax_rate, tax_code, short_desc, features, rating, review_count, icon, image, content, faqs, range, category_id)
values
  ('i-drops', 'I·DROPS Lubricating Eye Drops', 'Eye Drops', 'INO-IDR', 'Bestseller', 12, '3004',
   'Preservative-free lubricating drops that deliver long-lasting hydration and soothing relief for dry, tired and irritated eyes.',
   '["Long-lasting hydration","Soothes dry, tired eyes","Preservative-free formula","Suitable for daily use & contact-lens wearers"]'::jsonb,
   4.8, 356, 'drop', '/assets/img-3.webp',
   '{"origin":"Manufactured in India","ingredients":"Sodium Hyaluronate, purified water; free from preservatives, parabens & artificial colors","usage":"Instil 1–2 drops into the affected eye as needed. Suitable for daily use.","certifications":"Preservative-free · Lab-tested","shelf_life":"24 months","net_weight":"10 ml"}'::jsonb,
   '[{"q":"Can I use these with contact lenses?","a":"Yes — I·DROPS is preservative-free and suitable for contact-lens wearers."}]'::jsonb,
   'ethical', (select id from cat where slug='eye-drops')),
  ('i-omega-3', 'I·OMEGA-3 Eye Health Supplement', 'Vision Supplements', 'INO-OM3', 'Bestseller', 18, '2106',
   'Premium Omega-3 softgels that support macular health and vision function for people with high screen time and dry-eye tendency.',
   '["Supports macular health","Supports healthy vision function","Premium-quality Omega-3","30 easy-to-swallow softgels"]'::jsonb,
   4.8, 289, 'pill', '/assets/img-5.webp',
   '{"origin":"Manufactured in India","ingredients":"Omega-3 fatty acids (EPA & DHA) from fish oil, Vitamin E","usage":"Take one softgel daily with a meal, or as directed.","certifications":"Dietary supplement · FSSAI licensed","shelf_life":"24 months","net_weight":"30 softgels"}'::jsonb,
   '[{"q":"Does it help with dry eyes?","a":"Omega-3 fatty acids support the tear-film and macular health."}]'::jsonb,
   'nutraceutical', (select id from cat where slug='vision-supplements')),
  ('i-contact-lens-solution', 'I·CONTACT LENS SOLUTION (Multi-Purpose)', 'Contact Lens Care', 'INO-CLS', null, 18, '3307',
   'Sterile multi-purpose solution that cleans, rinses, disinfects, stores and lubricates all soft contact lenses in one simple step.',
   '["Cleans, rinses & disinfects","Stores & lubricates lenses","Multi-purpose one-step care","Sterile formula for all soft lenses"]'::jsonb,
   4.7, 204, 'bottle', '/assets/img-7.webp',
   '{"origin":"Manufactured in India","ingredients":"Sterile buffered isotonic solution with cleaning & disinfecting agents","usage":"Rinse, clean and store lenses as directed on the pack.","certifications":"Sterile · Multi-purpose","shelf_life":"24 months","net_weight":"120 ml"}'::jsonb,
   '[]'::jsonb,
   'ethical', (select id from cat where slug='contact-lens-care'))
on conflict (slug) do nothing;

insert into public.product_variants (product_id, label, sku, price, mrp, stock, sort_order)
select p.id, v.label, v.sku, v.price, v.mrp, v.stock, v.sort_order from public.products p join (values
  ('i-drops','10 ml','INO-IDR-10',189,240,160,0),
  ('i-drops','10 ml × 2 pack','INO-IDR-10X2',349,480,70,1),
  ('i-omega-3','30 softgels','INO-OM3-30',499,650,140,0),
  ('i-omega-3','30 softgels × 2 pack','INO-OM3-30X2',929,1300,60,1),
  ('i-contact-lens-solution','120 ml','INO-CLS-120',229,299,180,0),
  ('i-contact-lens-solution','120 ml × 2 pack','INO-CLS-120X2',419,598,75,1)
) as v(pslug,label,sku,price,mrp,stock,sort_order) on p.slug = v.pslug
on conflict (sku) do nothing;

insert into public.product_reviews (product_id, name, rating, text)
select p.id, r.name, r.rating, r.text from public.products p join (values
  ('i-drops','Priya S.',5,'Instant relief for my screen-tired eyes, no stinging.'),
  ('i-drops','Meera R.',4,'Great value in the twin pack.'),
  ('i-omega-3','Karthik V.',5,'My eyes feel less strained after long work days.'),
  ('i-contact-lens-solution','Pooja H.',5,'One bottle does everything — very convenient.')
) as r(pslug,name,rating,text) on p.slug = r.pslug;

-- ── Coupons ─────────────────────────────────────────────────────────────────
insert into public.coupons (code, type, value, description, active, cap, min_cart, expires_at) values
  ('WELCOME10','pct', 10,'10% off your first order', true, 0,   0, '2026-12-31'),
  ('FLAT50',   'flat',50,'₹50 off orders over ₹499', true, 0, 499, '2026-12-31')
on conflict (code) do nothing;

-- ── CMS + settings singletons ───────────────────────────────────────────────
insert into public.kv_settings (key, value) values
  ('cms', '{"announcement":"📦 Free shipping over ₹999 · 100% genuine, quality-assured products","heroTitle":"Eye care & vision wellness, made affordable for everyone.","returnPolicy":"7-day easy returns on unopened items."}'::jsonb),
  ('settings', '{"storeName":"Inovacure Pharmaceuticals","supportEmail":"info@inovacure.in","whatsapp":"919599597879","currency":"₹","freeShipThreshold":999,"flatShip":60,"gstin":"09ABCDE1234F1Z5","invoicePrefix":"INO-2026-","domain":"www.inovacure.in","returnPolicy":"7-day easy returns on unopened items.","paymentMethods":["UPI","Card","COD"]}'::jsonb),
  ('invoice_seq', '{"next":1041}'::jsonb)
on conflict (key) do nothing;

-- ── Owner staff row (link user_id after the owner signs up via Supabase Auth) ─
insert into public.staff (name, email, role, active) values
  ('Harun Riaz', 'harun.riaz@outlook.com', 'owner', true)
on conflict (email) do nothing;
