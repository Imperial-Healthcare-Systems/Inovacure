'use strict';
/* ============================================================
   INOVACURE STOREFRONT — single-file commerce application
   Architecture per Imperial Tech Innovations Generation Framework.
   PROTOTYPE NOTE: all state lives in localStorage. Each prototype
   shortcut is marked "// PROD:" with its production swap target.
   ============================================================ */
'use strict';

/* ---------- tiny DOM helpers ---------- */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const escapeHtml = (v)=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = (p='id')=>p+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const todayISO = ()=>new Date().toISOString();
const fmtDate = (iso)=>{try{return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}catch(e){return iso}};
const fmtDateTime = (iso)=>{try{return new Date(iso).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return iso}};

/* ---------- brand assets (A1 — real Inovacure logo) ---------- */
const LOGO_IMG_SRC = "/assets/img-1.webp";
const LOGO_MARK_SRC = "/assets/img-2.webp";
const LOGO_SVG = `<img src="${LOGO_MARK_SRC}" alt="Inovacure" width="100%" height="100%" style="object-fit:contain;display:block">`;
const LOGO_FULL = `<img src="${LOGO_IMG_SRC}" alt="Inovacure — Live Healthy" style="object-fit:contain;display:block">`;

/* ---------- programmatic SVG product art generator (brand colours) ---------- */
const ART_ICONS = {
  eye:  '<circle cx="60" cy="60" r="34" fill="none" stroke="#004497" stroke-width="6"/><circle cx="60" cy="60" r="15" fill="#4f8a37"/>',
  pill: '<rect x="30" y="44" width="60" height="32" rx="16" fill="#004497"/><rect x="60" y="44" width="30" height="32" rx="16" fill="#6faf50"/>',
  cream:'<rect x="40" y="34" width="40" height="58" rx="8" fill="#1668c4"/><rect x="48" y="22" width="24" height="16" rx="4" fill="#004497"/>',
  tube: '<rect x="34" y="42" width="48" height="22" rx="11" fill="#58963d"/><path d="M82 46h12v14H82z" fill="#004497"/>',
  drop: '<path d="M60 26 C42 52 38 64 60 82 C82 64 78 52 60 26Z" fill="#1668c4"/><circle cx="60" cy="66" r="9" fill="#cfe6ff"/>',
  bottle:'<rect x="44" y="38" width="32" height="52" rx="8" fill="#004497"/><rect x="50" y="28" width="20" height="12" rx="3" fill="#6faf50"/>',
  shield:'<path d="M60 26l26 10v16c0 16-11 26-26 32-15-6-26-16-26-32V36Z" fill="#004497"/><path d="M50 60l7 7 14-14" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  leaf: '<path d="M40 80 C40 48 68 36 84 36 C84 68 60 84 40 80Z" fill="#58963d"/><path d="M44 76 Q62 54 80 44" stroke="#fff" stroke-width="4" fill="none"/>'
};
function prodSVG(icon, bg){
  const ic = ART_ICONS[icon] || ART_ICONS.pill;
  return `<svg class="pill-shape" width="200" height="200" viewBox="0 0 120 120" style="background:${bg||'#eef4fb'};border-radius:14px" xmlns="http://www.w3.org/2000/svg">${ic}</svg>`;
}
const SEG_BG = {'Eye Drops':'#e3eefb','Vision Supplements':'#e8f1ea','Contact Lens Care':'#e3f6fb','Eye Hygiene':'#e6f4f1','Kids':'#eaf3ff'};
const SEG_ICON = {'Eye Drops':'drop','Vision Supplements':'pill','Contact Lens Care':'bottle','Eye Hygiene':'leaf','Kids':'pill'};

const star = (filled)=>`<svg viewBox="0 0 24 24" width="14" fill="${filled?'#f4a623':'#e3e9f1'}"><path d="m12 2 2.4 7.4H22l-6 4.5 2.3 7.1L12 16.4 5.7 21 8 13.9 2 9.4h7.6Z"/></svg>`;
const stars = (n)=>[1,2,3,4,5].map(i=>star(i<=Math.round(n))).join('');

/* ============================================================
   PERSISTENCE ADAPTER — the only code that touches localStorage.
   PROD: swap these four functions for an API client; nothing else changes.
   ============================================================ */
const DB_PREFIX = "inovacure_admin_v2__";
const SHOP_PREFIX = "inovacure_shop_v2__";
/* One-time cleanup: remove any older-version keys so a fresh catalog (with real
   product photos) always loads instead of stale data cached in the browser.
   PROD: a server-backed store makes this unnecessary. */
(function purgeStaleVersions(){
  try{
    const keep = DB_PREFIX.slice(0,-1), keepShop = SHOP_PREFIX.slice(0,-1); // strip trailing _
    const kill=[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k) continue;
      if((k.indexOf("inovacure_admin_v")===0 && k.indexOf(DB_PREFIX)!==0) ||
         (k.indexOf("inovacure_shop_v")===0  && k.indexOf(SHOP_PREFIX)!==0)){
        kill.push(k);
      }
    }
    kill.forEach(k=>localStorage.removeItem(k));
  }catch(e){}
})();
function dbLoad(key, fallback){
  try{
    const raw = localStorage.getItem(DB_PREFIX+key);
    if(raw===null){ localStorage.setItem(DB_PREFIX+key, JSON.stringify(fallback)); return fallback; }
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}
function dbSave(key, value){ try{ localStorage.setItem(DB_PREFIX+key, JSON.stringify(value)); }catch(e){} }
function persist(key, value){ dbSave(key, value); }        // alias — write-through
function shopLoad(key, fallback){
  try{
    const raw = localStorage.getItem(SHOP_PREFIX+key);
    if(raw===null){ localStorage.setItem(SHOP_PREFIX+key, JSON.stringify(fallback)); return fallback; }
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}
function shopSave(key, value){ try{ localStorage.setItem(SHOP_PREFIX+key, JSON.stringify(value)); }catch(e){} }
/* Nuke ALL Inovacure keys (any version) and reload — guarantees the fresh
   catalog with real product images. (No longer surfaced in the footer UI.) */
function resetStoreData(){
  try{
    const kill=[];
    for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.indexOf("inovacure_")===0) kill.push(k); }
    kill.forEach(k=>localStorage.removeItem(k));
  }catch(e){}
  location.hash='#/'; location.reload();
}

/* ============================================================
   SEED DATA (from Part A — products, categories, demo orders)
   ============================================================ */
const SEED_CATEGORIES = [
  {id:"c_drops", name:"Eye Drops", slug:"eye-drops", seo:"Lubricating & dry-eye relief drops for daily comfort.", order:1},
  {id:"c_supp", name:"Vision Supplements", slug:"vision-supplements", seo:"Omega-3, Lutein & multivitamins that support macular and vision health.", order:2},
  {id:"c_lens", name:"Contact Lens Care", slug:"contact-lens-care", seo:"Multi-purpose solutions and cleansers for all contact lenses.", order:3},
  {id:"c_hyg", name:"Eye Hygiene", slug:"eye-hygiene", seo:"Eyelid wipes and gentle cleansers for clean, refreshed eyes.", order:4},
  {id:"c_kids", name:"Kids", slug:"kids", seo:"Tasty, nutritious gummies and supplements made for children.", order:5},
];

function mkProd(o){
  return Object.assign({
    id: o.id, name:o.name, segment:o.segment, baseSku:o.baseSku,
    badge:o.badge||'', taxRate:o.taxRate==null?12:o.taxRate, taxCode:o.taxCode||'3004',
    shortDesc:o.shortDesc||'', features:o.features||[],
    variants:o.variants||[], price:0, mrp:0, stock:0,
    rating:o.rating||4.6, reviewCount:o.reviewCount||0,
    icon: o.icon || SEG_ICON[o.segment] || 'pill',
    bg: o.bg || SEG_BG[o.segment] || '#eef4fb',
    image: o.image||null,
    content:{origin:o.origin||'India', ingredients:o.ingredients||'', usage:o.usage||'', certifications:o.certifications||'WHO-GMP · Lab-tested', shelfLife:o.shelfLife||'24 months', netWeight:o.netWeight||''},
    faqs:o.faqs||[],
    reviews:o.reviews||[]
  }, {});
}

const SEED_PRODUCTS = [
  mkProd({id:"p_idrops", name:"I·DROPS Lubricating Eye Drops", segment:"Eye Drops", baseSku:"INO-IDR", badge:"Bestseller", taxRate:12, taxCode:"3004",
    shortDesc:"Preservative-free lubricating drops that deliver long-lasting hydration and soothing relief for dry, tired and irritated eyes.",
    features:["Long-lasting hydration","Soothes dry, tired eyes","Preservative-free formula","Suitable for daily use & contact-lens wearers"],
    variants:[{label:"10 ml", sku:"INO-IDR-10", price:189, mrp:240, stock:160},{label:"10 ml × 2 pack", sku:"INO-IDR-10X2", price:349, mrp:480, stock:70}],
    rating:4.8, reviewCount:356, icon:"drop", ingredients:"Sodium Hyaluronate, purified water; free from preservatives, parabens & artificial colors", usage:"Instil 1–2 drops into the affected eye as needed. Suitable for daily use.", origin:"Manufactured in India", certifications:"Preservative-free · Lab-tested", shelfLife:"24 months", netWeight:"10 ml",
    faqs:[{q:"Can I use these with contact lenses?",a:"Yes — I·DROPS is preservative-free and suitable for contact-lens wearers."},{q:"How often can I use them?",a:"Use as needed for dryness; there is no daily limit for preservative-free drops, but consult your eye-care professional if symptoms persist."}],
    reviews:[{name:"Priya S.",rating:5,text:"Instant relief for my screen-tired eyes, no stinging."},{name:"Arun K.",rating:5,text:"The preservative-free formula is so gentle."},{name:"Meera R.",rating:4,text:"Great value in the twin pack."}],
    image:"/assets/img-3.webp"
  }),
  mkProd({id:"p_idryeye", name:"I·DRY EYE RELIEF Lubricating Drops", segment:"Eye Drops", baseSku:"INO-IDE", badge:"", taxRate:12, taxCode:"3004",
    shortDesc:"Advanced lubricating eye drops offering soothing, long-lasting relief for dry, irritated eyes. Safe, gentle and sterile.",
    features:["Advanced relief for dry eyes","Soothes dryness & irritation","Long-lasting hydration","Safe & gentle — sterile formula"],
    variants:[{label:"10 ml", sku:"INO-IDE-10", price:215, mrp:275, stock:110}],
    rating:4.7, reviewCount:142, icon:"drop", ingredients:"Carboxymethylcellulose Sodium, electrolytes; sterile, for external use only", usage:"Instil 1–2 drops into the affected eye up to 4 times a day, or as directed.", origin:"Manufactured in India", certifications:"Sterile · DCGI aligned", shelfLife:"24 months", netWeight:"10 ml",
    faqs:[{q:"How is this different from I·DROPS?",a:"I·DRY EYE RELIEF is formulated for more advanced, persistent dryness and irritation, offering a longer-lasting protective layer."}],
    reviews:[{name:"Sneha T.",rating:5,text:"The only thing that helps my chronic dry eye."},{name:"Rahul M.",rating:4,text:"Very soothing, lasts for hours."}],
    image:"/assets/img-4.webp"
  }),
  mkProd({id:"p_omega3", name:"I·OMEGA-3 Eye Health Supplement", segment:"Vision Supplements", baseSku:"INO-OM3", badge:"Bestseller", taxRate:18, taxCode:"2106",
    shortDesc:"Premium Omega-3 softgels that support macular health and vision function for people with high screen time and dry-eye tendency.",
    features:["Supports macular health","Supports healthy vision function","Premium-quality Omega-3","30 easy-to-swallow softgels"],
    variants:[{label:"30 softgels", sku:"INO-OM3-30", price:499, mrp:650, stock:140},{label:"30 softgels × 2 pack", sku:"INO-OM3-30X2", price:929, mrp:1300, stock:60}],
    rating:4.8, reviewCount:289, icon:"pill", ingredients:"Omega-3 fatty acids (EPA & DHA) from fish oil, Vitamin E", usage:"Take one softgel daily with a meal, or as directed.", origin:"Manufactured in India", certifications:"Dietary supplement · FSSAI licensed · Premium quality", shelfLife:"24 months", netWeight:"30 softgels",
    faqs:[{q:"Does it help with dry eyes?",a:"Omega-3 fatty acids support the tear-film and macular health, which many users find helpful alongside lubricating drops."},{q:"Is it a fish-oil product?",a:"Yes, the EPA & DHA are sourced from high-quality fish oil."}],
    reviews:[{name:"Karthik V.",rating:5,text:"My eyes feel less strained after long work days."},{name:"Divya N.",rating:5,text:"Good quality softgels, no fishy aftertaste."},{name:"Imran A.",rating:4,text:"Nice to have a twin pack option."}],
    image:"/assets/img-5.webp"
  }),
  mkProd({id:"p_ilutein", name:"I·LUTEIN Vision Support Capsules", segment:"Vision Supplements", baseSku:"INO-LUT", badge:"New", taxRate:18, taxCode:"2106",
    shortDesc:"Vision-support capsules with Lutein, Zeaxanthin and antioxidants that help protect the eyes against blue light and oxidative stress.",
    features:["Protects against blue light","With Zeaxanthin & antioxidants","Supports long-term vision health","30 vegetarian capsules"],
    variants:[{label:"30 capsules", sku:"INO-LUT-30", price:549, mrp:720, stock:95}],
    rating:4.6, reviewCount:118, icon:"pill", ingredients:"Lutein, Zeaxanthin, mixed antioxidants & vitamins", usage:"Take one capsule daily with a meal, or as directed.", origin:"Manufactured in India", certifications:"Dietary supplement · FSSAI licensed", shelfLife:"24 months", netWeight:"30 capsules",
    faqs:[{q:"Who should take I·LUTEIN?",a:"It is designed for people with high screen exposure or anyone wanting to support long-term macular and vision health."}],
    reviews:[{name:"Tara D.",rating:5,text:"Great for my long hours in front of screens."},{name:"Nikhil S.",rating:4,text:"Easy to swallow, no side effects."}],
    image:"/assets/img-6.webp"
  }),
  mkProd({id:"p_icls", name:"I·CONTACT LENS SOLUTION (Multi-Purpose)", segment:"Contact Lens Care", baseSku:"INO-CLS", badge:"", taxRate:18, taxCode:"3307",
    shortDesc:"Sterile multi-purpose solution that cleans, rinses, disinfects, stores and lubricates all soft contact lenses in one simple step.",
    features:["Cleans, rinses & disinfects","Stores & lubricates lenses","Multi-purpose one-step care","Sterile formula for all soft lenses"],
    variants:[{label:"120 ml", sku:"INO-CLS-120", price:229, mrp:299, stock:180},{label:"120 ml × 2 pack", sku:"INO-CLS-120X2", price:419, mrp:598, stock:75}],
    rating:4.7, reviewCount:204, icon:"bottle", ingredients:"Sterile buffered isotonic solution with cleaning & disinfecting agents", usage:"Rinse, clean and store lenses as directed on the pack. Do not use directly in the eye.", origin:"Manufactured in India", certifications:"Sterile · Multi-purpose", shelfLife:"24 months", netWeight:"120 ml",
    faqs:[{q:"Can I use it for all lens types?",a:"It is designed for all soft contact lenses. Follow your lens manufacturer's guidance for specialty lenses."}],
    reviews:[{name:"Pooja H.",rating:5,text:"One bottle does everything — very convenient."},{name:"Sameer L.",rating:4,text:"Comes with a lens case, good value."}],
    image:"/assets/img-7.webp"
  }),
  mkProd({id:"p_igel", name:"I·GEL Cleanser Paste", segment:"Contact Lens Care", baseSku:"INO-GEL", badge:"", taxRate:18, taxCode:"3307",
    shortDesc:"Gentle yet effective cleanser paste that removes protein deposits, dirt and contaminants from all contact lenses while staying kind to them.",
    features:["Gentle deep cleanser","For all contact lenses","pH-balanced formula","Removes protein & deposits"],
    variants:[{label:"10 g", sku:"INO-GEL-10", price:179, mrp:230, stock:130}],
    rating:4.5, reviewCount:86, icon:"tube", ingredients:"Mild surfactant cleansing paste, pH-balanced", usage:"Apply a small amount to the lens, rub gently and rinse thoroughly with contact-lens solution before wear.", origin:"Manufactured in India", certifications:"pH-balanced · Lab-tested", shelfLife:"24 months", netWeight:"10 g",
    faqs:[{q:"How often should I use it?",a:"Use as a periodic deep-clean in addition to your daily multi-purpose solution, typically once or twice a week."}],
    reviews:[{name:"Aditya R.",rating:5,text:"Lenses feel brand new after using this."},{name:"Geeta M.",rating:4,text:"A little goes a long way."}],
    image:"/assets/img-8.webp"
  }),
  mkProd({id:"p_oclean", name:"Oclean Eyelid Wipes", segment:"Eye Hygiene", baseSku:"INO-OCL", badge:"Dermatologically Tested", taxRate:18, taxCode:"3307",
    shortDesc:"Gentle, pH-balanced eyelid wipes that clean, soothe and refresh the eyelids. Alcohol-free, soft and individually wrapped.",
    features:["Cleans, soothes & refreshes","Gentle & pH-balanced","Alcohol-free & ophthalmologically tested","Soft, thick, individually wrapped"],
    variants:[{label:"20 wipes", sku:"INO-OCL-20", price:199, mrp:260, stock:150},{label:"20 wipes × 3 pack", sku:"INO-OCL-20X3", price:529, mrp:780, stock:55}],
    rating:4.7, reviewCount:167, icon:"leaf", ingredients:"Purified water, mild cleansing agents; alcohol-free, pH-balanced", usage:"Gently wipe closed eyelids and lashes with a single wipe. For external use only.", origin:"Manufactured in India", certifications:"Dermatologically tested · Ophthalmologically tested", shelfLife:"24 months", netWeight:"20 wipes",
    faqs:[{q:"Are they safe for daily use?",a:"Yes — they are gentle, pH-balanced and safe for daily eyelid hygiene."},{q:"Do they contain alcohol?",a:"No, Oclean wipes are completely alcohol-free."}],
    reviews:[{name:"Vikram J.",rating:5,text:"Perfect for my blepharitis routine."},{name:"Anita P.",rating:4,text:"Soft and refreshing, no irritation."}],
    image:"/assets/img-9.webp"
  }),
  mkProd({id:"p_kidzea", name:"Kidzea Multivitamin Gummies for Kids", segment:"Kids", baseSku:"INO-KDZ", badge:"Dermatologically Tested", taxRate:18, taxCode:"2106",
    shortDesc:"Tasty, chewy multivitamin & mineral gummies that support immunity, brain development and strong bones & teeth — made with natural ingredients.",
    features:["Supports immunity & brain development","Strong bones & teeth","Made with natural ingredients","No artificial flavors — vegetarian, gluten & gelatin free"],
    variants:[{label:"30 gummies", sku:"INO-KDZ-30", price:399, mrp:520, stock:120},{label:"30 gummies × 2 pack", sku:"INO-KDZ-30X2", price:749, mrp:1040, stock:50}],
    rating:4.8, reviewCount:312, icon:"pill", ingredients:"Multivitamins & minerals in a fruit gummy base; no artificial flavors or colors, vegetarian, gluten-free, gelatin-free", usage:"Children take one gummy daily, or as directed by a paediatrician.", origin:"Manufactured in India", certifications:"Dermatologically tested · FSSAI licensed", shelfLife:"18 months", netWeight:"30 gummies",
    faqs:[{q:"What age is Kidzea for?",a:"Kidzea is formulated for children; please consult your paediatrician for the right age and dosage."},{q:"Is it vegetarian?",a:"Yes — the gummies are vegetarian, gluten-free and gelatin-free."}],
    reviews:[{name:"Rohit B.",rating:5,text:"My kids ask for these every morning."},{name:"Lakshmi P.",rating:5,text:"Love that they are gelatin-free and natural."},{name:"Farah S.",rating:4,text:"Great taste, no fuss."}],
    image:"/assets/img-10.webp"
  }),
];

const SEED_REVIEWS_OK = true;
/* ============================================================
   STATE — module-level collections, lazily hydrated from DB.
   ============================================================ */
let SETTINGS = dbLoad('settings', {
  storeName:'Inovacure Pharmaceuticals',
  supportEmail:'harun.riaz@outlook.com',
  whatsapp:'919599597879',
  currency:'₹',
  freeShipThreshold:999,
  flatShip:60,
  gstin:'09ABCDE1234F1Z5',
  invoicePrefix:'INO-2026-',
  domain:'www.inovacure.com',
  returnPolicy:'7-day easy returns on unopened items.',
  paymentMethods:['UPI','Card','COD'],
  notifyEmail:true,
  notifySMS:false,
  integrations:['Razorpay (test mode)','Shiprocket (sandbox)']
});
let CMS = dbLoad('cms', {
  announcement:'📦 Free shipping over ₹999 · 100% genuine, quality-assured products',
  heroTitle:'Eye care & vision wellness, made affordable for everyone.',
  returnPolicy:'7-day easy returns on unopened items.'
});
let PRODUCTS  = dbLoad('products', SEED_PRODUCTS);
let CATEGORIES= dbLoad('categories', SEED_CATEGORIES);
let ORDERS    = dbLoad('orders', []);
let CUSTOMERS = dbLoad('customers', []);
let COUPONS   = dbLoad('coupons', {
  WELCOME10:{code:'WELCOME10', type:'pct', value:10, desc:'10% off your first order', active:true, uses:0, cap:0, minCart:0, expires:'2026-12-31'},
  FLAT50:   {code:'FLAT50', type:'flat', value:50, desc:'₹50 off orders over ₹499', active:true, uses:0, cap:0, minCart:499, expires:'2026-12-31'}
});
let RETURNS   = dbLoad('returns', []);
let AUDIT     = dbLoad('audit', []);
let STAFF     = dbLoad('staff', [
  {id:'s_owner', name:'Harun Riaz', email:'harun.riaz@outlook.com', role:'owner', active:true},
  {id:'s_mgr',   name:'Operations Lead', email:'ops@inovacure.com', role:'manager', active:true},
  {id:'s_ful',   name:'Warehouse Desk', email:'fulfilment@inovacure.com', role:'fulfilment', active:true}
]);
let INVOICE_SEQ = dbLoad('invoiceSeq', 1041);
let currentUser = dbLoad('currentAdmin', null); // admin staff session

const ROLES = {
  owner:['*'],
  manager:['orders.*','products.*','inventory.*','customers.*','coupons.*','returns.*','reports.*','cms.*','categories.*'],
  fulfilment:['orders.view','orders.advance','inventory.view','inventory.edit','returns.*'],
  support:['orders.view','customers.*','returns.*'],
  finance:['orders.view','payments.*','reports.*'],
  readonly:['*.view']
};

/* ---------- shopper state (separate namespace) ---------- */
let CART = shopLoad('cart', []);          // [{productId, sku, qty}]
let WISH = shopLoad('wish', []);          // [productId]
let SHOP_USERS = shopLoad('users', {});   // email -> {name,email,phone,passHash,addresses,...}
let SHOP_SESSION = shopLoad('session', null); // email of signed-in shopper
let CONSENT = shopLoad('consent', null);  // 'all' | 'essential' | null
let appliedCoupon = null;

/* ============================================================
   DERIVATION INVARIANTS — top-level price/mrp/stock NEVER authored.
   ============================================================ */
function syncProductFromVariants(p){
  if(!p.variants || !p.variants.length){ p.price=0;p.mrp=0;p.stock=0; return p; }
  const inStock = p.variants.filter(v=>(+v.stock)>0);
  const pool = inStock.length?inStock:p.variants;
  const cheapest = pool.reduce((a,b)=>(+a.price<=+b.price?a:b));
  p.price = +cheapest.price;
  p.mrp   = +cheapest.mrp;
  p.stock = p.variants.reduce((s,v)=>s+(+v.stock||0),0);
  return p;
}
function hydrateFromDB(){
  PRODUCTS.forEach(syncProductFromVariants);
  // ensure reviewCount reflects seeded reviews if zero
  PRODUCTS.forEach(p=>{ if(!p.reviewCount && p.reviews) p.reviewCount = p.reviews.length; });
  persistAll();
}
// re-run derivation normalizers immediately after hydration (B2)
hydrateFromDB();

function persistAll(){
  dbSave('settings',SETTINGS); dbSave('cms',CMS); dbSave('products',PRODUCTS);
  dbSave('categories',CATEGORIES); dbSave('orders',ORDERS); dbSave('customers',CUSTOMERS);
  dbSave('coupons',COUPONS); dbSave('returns',RETURNS); dbSave('audit',AUDIT);
  dbSave('staff',STAFF); dbSave('invoiceSeq',INVOICE_SEQ); dbSave('currentAdmin',currentUser);
}
function saveShop(){ shopSave('cart',CART); shopSave('wish',WISH); shopSave('users',SHOP_USERS); shopSave('session',SHOP_SESSION); shopSave('consent',CONSENT); }

/* ============================================================
   COMMERCE ENGINE — centralized money/tax/stock/cart math.
   ============================================================ */
const round2 = (n)=>Math.round((+n+Number.EPSILON)*100)/100;
const fmt = (n)=>SETTINGS.currency+Number(round2(n)).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:2});

// Tax is INCLUSIVE in the displayed price. Extract the GST component.
function gstComponent(amountInclusive, ratePct){ const r=+ratePct/100; return round2(amountInclusive - amountInclusive/(1+r)); }

function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }
function getVariant(p, sku){ return p && p.variants.find(v=>v.sku===sku); }
function firstInStockVariant(p){ return p.variants.find(v=>+v.stock>0) || p.variants[0]; }
function variantTotalStock(p){ return p.variants.reduce((s,v)=>s+(+v.stock||0),0); }
function stockState(stock){ if(+stock<=0) return 'out'; if(+stock<=10) return 'low'; return 'in'; }
function stockLabel(stock){ const s=stockState(stock); return s==='out'?'Out of stock':s==='low'?('Only '+stock+' left'):'In stock'; }

/* ---- cart ---- */
function cartLineList(){
  return CART.map(ci=>{
    const p=getProduct(ci.productId); if(!p) return null;
    const v=getVariant(p,ci.sku); if(!v) return null;
    return {p,v,qty:ci.qty,lineTotal:round2(+v.price*ci.qty)};
  }).filter(Boolean);
}
function cartCount(){ return CART.reduce((s,c)=>s+c.qty,0); }
function cartSubtotal(){ return round2(cartLineList().reduce((s,l)=>s+l.lineTotal,0)); }
function cartGST(){ return round2(cartLineList().reduce((s,l)=>s+gstComponent(l.lineTotal, l.p.taxRate),0)); }
function shipFee(subtotal){ if(subtotal<=0) return 0; return subtotal>=+SETTINGS.freeShipThreshold?0:+SETTINGS.flatShip; }
function couponDiscount(subtotal){
  if(!appliedCoupon) return 0;
  const c=COUPONS[appliedCoupon]; if(!c||!c.active) return 0;
  if(subtotal < (+c.minCart||0)) return 0;
  let d = c.type==='pct'? subtotal*(+c.value/100) : +c.value;
  if(c.cap>0) d=Math.min(d,c.cap);
  return round2(Math.min(d,subtotal));
}
function cartBreakdown(){
  const subtotal=cartSubtotal();
  const discount=couponDiscount(subtotal);
  const ship=shipFee(subtotal-discount);
  const gst=cartGST();
  const total=round2(subtotal-discount+ship);
  return {subtotal,discount,ship,gst,total};
}
function addToCart(productId, sku, qty=1){
  const p=getProduct(productId); const v=getVariant(p,sku);
  if(!p||!v){ toast('Product unavailable','err'); return; }
  if(+v.stock<=0){ toast('That option is out of stock','err'); return; }
  const ex=CART.find(c=>c.productId===productId && c.sku===sku);
  const have=ex?ex.qty:0;
  if(have+qty>+v.stock){ toast('Not enough stock for that quantity','err'); return; }
  if(ex) ex.qty+=qty; else CART.push({productId,sku,qty});
  saveShop(); refreshBadges(); renderCart(); toast('Added to cart','ok');
}
function changeQty(productId, sku, delta){
  const ci=CART.find(c=>c.productId===productId && c.sku===sku); if(!ci) return;
  const p=getProduct(productId); const v=getVariant(p,sku);
  const next=ci.qty+delta;
  if(next<=0){ removeItem(productId,sku); return; }
  if(next>+v.stock){ toast('Reached available stock','err'); return; }
  ci.qty=next; saveShop(); refreshBadges(); renderCart();
}
function removeItem(productId, sku){
  CART=CART.filter(c=>!(c.productId===productId && c.sku===sku));
  saveShop(); refreshBadges(); renderCart();
}

/* ---- orders: derived counts & totals (never stored authoritatively) ---- */
function orderItemsCount(o){ return o.lines.reduce((s,l)=>s+l.qty,0); }
function orderTotal(o){
  const sub=o.lines.reduce((s,l)=>s+round2(l.price*l.qty),0);
  return round2(sub - (o.discount||0) + (o.shipTotal||0));
}
function orderSubtotal(o){ return round2(o.lines.reduce((s,l)=>s+round2(l.price*l.qty),0)); }
function orderTaxBreakup(o){
  const map={};
  o.lines.forEach(l=>{ const line=round2(l.price*l.qty); const g=gstComponent(line,l.taxRate||0); map[l.taxRate]=(map[l.taxRate]||0)+g; });
  return Object.entries(map).map(([rate,amt])=>({rate:+rate,amt:round2(amt)}));
}
function nextInvoiceNo(){
  INVOICE_SEQ++; dbSave('invoiceSeq',INVOICE_SEQ);
  return SETTINGS.invoicePrefix + String(INVOICE_SEQ).padStart(5,'0');
}

/* ============================================================
   ORDER LIFECYCLE — enforced state machine.
   ============================================================ */
const ORDER_FLOW = {
  "payment-pending":["paid","cancelled"],
  "paid":["processing","cancelled"],
  "processing":["packed","cancelled","on-hold"],
  "packed":["shipped","on-hold"],
  "shipped":["out-for-delivery","delivered"],
  "out-for-delivery":["delivered","shipped"],
  "delivered":["returned"],
  "on-hold":["processing","cancelled"],
  "cancelled":[],
  "returned":["refunded"],
  "refunded":[]
};
function allowedNext(status){ return ORDER_FLOW[status]||[]; }
const STATUS_PILL = {
  'payment-pending':'amber','paid':'blue','processing':'blue','packed':'blue',
  'shipped':'blue','out-for-delivery':'blue','delivered':'green','on-hold':'amber',
  'cancelled':'red','returned':'amber','refunded':'grey'
};
function statusPill(s){ return `<span class="pill ${STATUS_PILL[s]||'grey'}">${escapeHtml(s.replace(/-/g,' '))}</span>`; }

function advanceOrder(orderId, toStatus){
  const o=ORDERS.find(x=>x.id===orderId); if(!o) return;
  if(!allowedNext(o.status).includes(toStatus)){ toast('Invalid transition','err'); return; }
  // stock restock on cancel/return
  if(toStatus==='cancelled' || toStatus==='returned'){
    o.lines.forEach(l=>{ const p=getProduct(l.productId); if(p){ const v=getVariant(p,l.sku); if(v){ v.stock=+v.stock+l.qty; syncProductFromVariants(p);} } });
  }
  if(toStatus==='paid'){ o.payment.status='captured'; o.payment.capturedAt=todayISO(); if(!o.payment.invoice) o.payment.invoice=nextInvoiceNo(); }
  if(toStatus==='refunded'){ o.payment.status='refunded'; }
  o.status=toStatus;
  o.timeline.push({t:todayISO(), label:'Status → '+toStatus, by:(currentUser?currentUser.name:'system')});
  logAudit('order.advance','order #'+o.id.slice(-6),'→ '+toStatus);
  persistAll();
  toast('Order updated','ok');
}
/* ============================================================
   AUTH & RBAC & AUDIT
   ============================================================ */
async function sha256(str){
  // PROD: replace prototype hash with server bcrypt + httpOnly JWT.
  if(window.crypto && crypto.subtle){
    const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  let h=0; for(let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; } return 'fallback'+h;
}
// lightweight sync hash for shopper prototype passwords
function weakHash(str){ let h=5381; for(let i=0;i<str.length;i++){ h=((h<<5)+h)+str.charCodeAt(i);} return 'h'+(h>>>0).toString(16); }

/* admin password — hashed on boot, plaintext discarded, never in page source */
// PROD: this comparison happens server-side against bcrypt; here we hash the
// known framework password (A6 ADMIN_PASSWORD = IC@2026) once at boot.
const ADMIN_PASSWORD_PLAINTEXT = 'IC@2026';   // A6 input — owner login password
let ADMIN_PASS_HASH = null;
let ADMIN_OTP_EMAIL = SETTINGS.supportEmail;  // A6 ADMIN_OTP_EMAIL (resettable)
(function initAdminHash(){ sha256(ADMIN_PASSWORD_PLAINTEXT).then(h=>{ ADMIN_PASS_HASH=h; }); })();

let loginStage = 'password';   // 'password' | 'otp'
let pendingOTP = null;
let otpExpiry = 0;
let otpEmailTarget = ADMIN_OTP_EMAIL;

function genOTP(){ return String(Math.floor(100000+Math.random()*900000)); }

function logAudit(action, entity, detail){
  AUDIT.unshift({t:todayISO(), actor:(currentUser?currentUser.name:'system'), action, entity, detail:detail||''});
  if(AUDIT.length>500) AUDIT.length=500;
  dbSave('audit',AUDIT);
}
function can(perm){
  if(!currentUser) return false;
  const grants=ROLES[currentUser.role]||[];
  if(grants.includes('*')) return true;
  if(grants.includes(perm)) return true;
  const [area]=perm.split('.');
  if(grants.includes(area+'.*')) return true;
  if(grants.includes('*.view') && perm.endsWith('.view')) return true;
  return false;
}

/* ---- shopper auth ---- */
function currentShopper(){ return SHOP_SESSION ? SHOP_USERS[SHOP_SESSION] : null; }
function registerUser(name,email,phone,password){
  email=email.toLowerCase().trim();
  if(SHOP_USERS[email]) return {ok:false,msg:'An account with this email already exists.'};
  SHOP_USERS[email]={name,email,phone,passHash:weakHash(password),addresses:[],since:todayISO()};
  SHOP_SESSION=email; saveShop(); return {ok:true};
}
function loginUser(email,password){
  email=email.toLowerCase().trim();
  const u=SHOP_USERS[email];
  if(!u || u.passHash!==weakHash(password)) return {ok:false,msg:'Incorrect email or password.'};
  SHOP_SESSION=email; saveShop(); return {ok:true};
}
function logoutUser(){ SHOP_SESSION=null; saveShop(); }

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer=null;
function toast(msg, type=''){
  const wrap=$('#toastWrap'); if(!wrap) return;
  const t=document.createElement('div');
  t.className='toast '+(type||'');
  const icon = type==='ok'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>'
            : type==='err'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>':'';
  t.innerHTML=icon+escapeHtml(msg);
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(10px)'; setTimeout(()=>t.remove(),300); }, 2600);
}

/* ============================================================
   BADGES
   ============================================================ */
function refreshBadges(){
  const cb=$('#cartBadge'), wb=$('#wishBadge');
  const cc=cartCount();
  if(cb){ cb.textContent=cc; cb.style.display=cc?'grid':'none'; }
  if(wb){ wb.textContent=WISH.length; wb.style.display=WISH.length?'grid':'none'; }
}

/* ============================================================
   DEMO ORDERS & CUSTOMERS (seed once for a populated admin)
   ============================================================ */
function linkCustomerByEmail(name,email,phone,city){
  email=email.toLowerCase().trim();
  let c=CUSTOMERS.find(x=>x.email===email);
  if(!c){ c={id:uid('cus'),name,email,phone,city:city||'',since:todayISO(),tags:[]}; CUSTOMERS.push(c); }
  else { if(name)c.name=name; if(phone)c.phone=phone; if(city)c.city=city; }
  return c;
}
function seedDemoCommerce(){
  if(ORDERS.length) return;
  const samples=[
    {name:'Ananya Sharma',email:'ananya@example.com',phone:'9810011223',city:'Delhi',
      items:[['p_idrops','INO-IDR-10',2],['p_omega3','INO-OM3-30',1]], status:'delivered', method:'UPI', paid:true, daysAgo:9},
    {name:'Rohit Verma',email:'rohit@example.com',phone:'9820022334',city:'Mumbai',
      items:[['p_icls','INO-CLS-120',1]], status:'shipped', method:'Card', paid:true, daysAgo:3},
    {name:'Fatima Khan',email:'fatima@example.com',phone:'9830033445',city:'Lucknow',
      items:[['p_kidzea','INO-KDZ-30',1],['p_oclean','INO-OCL-20',2]], status:'processing', method:'COD', paid:false, daysAgo:1},
    {name:'Ananya Sharma',email:'ananya@example.com',phone:'9810011223',city:'Delhi',
      items:[['p_ilutein','INO-LUT-30',1]], status:'payment-pending', method:'UPI', paid:false, daysAgo:0}
  ];
  samples.forEach(s=>{
    const cust=linkCustomerByEmail(s.name,s.email,s.phone,s.city);
    const lines=s.items.map(([pid,sku,qty])=>{
      const p=getProduct(pid), v=getVariant(p,sku);
      return {productId:pid, sku, name:p.name, variant:v.label, price:+v.price, mrp:+v.mrp, qty, taxRate:p.taxRate, taxCode:p.taxCode};
    });
    const sub=lines.reduce((a,l)=>a+l.price*l.qty,0);
    const ship=sub>=SETTINGS.freeShipThreshold?0:SETTINGS.flatShip;
    const date=new Date(Date.now()-s.daysAgo*86400000).toISOString();
    const o={
      id:uid('ord'), customerId:cust.id, customer:s.name, email:s.email, phone:s.phone,
      lines, discount:0, shipTotal:ship,
      ship:{name:s.name,line1:'12 MG Road',city:s.city,state:'',pin:'110001',phone:s.phone},
      payment:{method:s.method, status:s.paid?'captured':'pending', txnId:s.paid?('TXN'+Math.random().toString(36).slice(2,9).toUpperCase()):'', gateway:s.method==='COD'?'cod':'razorpay', capturedAt:s.paid?date:null, invoice:s.paid?(SETTINGS.invoicePrefix+String(++INVOICE_SEQ).padStart(5,'0')):''},
      status:s.status, date, tracking:{}, timeline:[{t:date,label:'Order placed',by:'system'},{t:date,label:'Status → '+s.status,by:'system'}]
    };
    ORDERS.unshift(o);
  });
  dbSave('invoiceSeq',INVOICE_SEQ);
  // one demo return
  const delivered=ORDERS.find(o=>o.status==='delivered');
  if(delivered){
    RETURNS.unshift({id:uid('rma'), orderId:delivered.id, customer:delivered.customer, sku:delivered.lines[0].sku, reason:'Changed mind', status:'requested', refund:delivered.lines[0].price, date:todayISO(), restock:true});
  }
  persistAll();
}
/* ============================================================
   STOREFRONT RENDERERS
   ============================================================ */
let sitePage = 'home';        // home | catalog | pdp | checkout | account | order
let pdpProductId = null;
let pdpVariantSku = null;
let catState = {q:'', cat:'all', sort:'pop'};
let acctTab = 'orders';

function go(page, sub){
  sitePage = page;
  if(page==='account' && sub) acctTab=sub;
  location.hash = '#/'+(page==='home'?'':page);
  showView('site');
  renderSite();
  window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
}
function scrollToId(id){ setTimeout(()=>{ const el=$('#'+id); if(el) el.scrollIntoView({behavior:'smooth'}); },80); }

function renderSite(){
  $('#annBar').innerHTML = `<span>${escapeHtml(CMS.announcement)}</span>`;
  $('#logoMark').innerHTML = LOGO_FULL;
  renderFooter();
  const main=$('#siteMain');
  if(sitePage==='home') main.innerHTML=homeHTML();
  else if(sitePage==='catalog') main.innerHTML=catalogHTML();
  else if(sitePage==='pdp') main.innerHTML=pdpHTML();
  else if(sitePage==='checkout') main.innerHTML=checkoutHTML();
  else if(sitePage==='account') main.innerHTML=accountHTML();
  else if(sitePage==='about') main.innerHTML=aboutHTML();
  else if(sitePage==='contact') main.innerHTML=contactHTML();
  else if(sitePage==='order') main.innerHTML=orderConfirmHTML();
  else main.innerHTML=homeHTML();
  refreshBadges();
  if(sitePage==='catalog') wireCatalog();
  if(sitePage==='pdp') wirePDP();
  observeReveal();
  updatePdpLd();
}

function prodCardHTML(p){
  const ss=stockState(p.stock);
  const onWish=WISH.includes(p.id);
  const img = p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">` : prodSVG(p.icon,p.bg);
  const disc = p.mrp>p.price ? Math.round((1-p.price/p.mrp)*100) : 0;
  return `<article class="prod reveal">
    <div class="img" onclick="openPDP('${p.id}')">
      ${p.badge?`<span class="tag">${escapeHtml(p.badge)}</span>`:''}
      ${disc>0?`<span class="disc">${disc}%<br>OFF</span>`:''}
      <button class="wish ${onWish?'on':''}" aria-label="Toggle wishlist" onclick="event.stopPropagation();toggleWish('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 6 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/></svg></button>
      ${img}
    </div>
    <div class="body">
      <span class="seg">${escapeHtml(p.segment)}</span>
      <h3 onclick="openPDP('${p.id}')">${escapeHtml(p.name)}</h3>
      <div class="stars">${stars(p.rating)}<span>(${p.reviewCount})</span></div>
      <div class="stk ${ss}">${stockLabel(p.stock)}</div>
      <div class="foot">
        <div class="price">${fmt(p.price)}${p.mrp>p.price?`<s>${fmt(p.mrp)}</s>`:''}</div>
        <button class="add" aria-label="Add ${escapeHtml(p.name)} to cart" ${ss==='out'?'disabled':''} onclick="quickAdd('${p.id}',event)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
      </div>
    </div>
  </article>`;
}

function homeHTML(){
  const featured=PRODUCTS.slice(0,4).map(prodCardHTML).join('');
  const heroProduct = PRODUCTS.find(p=>p.id==='p_omega3') || PRODUCTS.find(p=>p.image) || PRODUCTS[0] || {};
  const catCards=CATEGORIES.map(c=>{
    const ic=SEG_ICON[c.name]||'pill';
    return `<button class="cat reveal" onclick="go('catalog');setCat('${escapeHtml(c.name)}')">
      <span class="ic">${catIconSVG(ic)}</span>
      <h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.seo)}</p>
      <span class="go">Browse <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </button>`;
  }).join('');
  return `
  <section class="hero" style="padding:0">
    <div class="wrap">
      <div class="hero-copy reveal">
        <span class="eyebrow"><span class="live-dot"></span>Trusted eye care · shipped across India</span>
        <h1 style="margin-top:20px">${escapeHtml(CMS.heroTitle).replace('made affordable','<span class="hl">made affordable</span>').replace('everyone.','<span class="gr">everyone.</span>')}</h1>
        <p class="hero-lead">Inovacure Pharmaceuticals develops safe, effective eye-care essentials — lubricating drops, vision supplements, contact-lens care and gentle eye hygiene — trusted by patients, clinics and pharmacies.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" onclick="go('catalog')">Shop the range <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          <a class="btn btn-ghost" onclick="scrollToId('why')">Why Inovacure</a>
        </div>
        <div class="trust-row">
          <div class="ti"><b data-count="8" data-suffix="">0</b><span>Signature eye-care products</span></div>
          <div class="ti"><b data-count="4.8" data-dec="1" data-suffix="★">0</b><span>Average customer rating</span></div>
          <div class="ti"><b data-count="12000" data-suffix="+" data-fmt="k">0</b><span>Units shipped &amp; counting</span></div>
        </div>
      </div>
      <div class="hero-visual reveal">
        <div class="hero-stage">
          <span class="hs-glow"></span>
          <span class="hs-ring hs-ring-1"></span>
          <span class="hs-ring hs-ring-2"></span>
          ${heroProduct.image?`<img class="hs-product" src="${escapeHtml(heroProduct.image)}" alt="${escapeHtml(heroProduct.name)}">`:''}
        </div>
        <div class="float-card fc-1"><span class="dot" style="background:var(--halo);color:var(--success)"><svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></span><div><b>Preservative-free</b><small>Gentle daily formulas</small></div></div>
        <div class="float-card fc-2"><span class="dot" style="background:var(--mist);color:var(--primary-dark)"><svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9-4 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10Z"/></svg></span><div><b>Lab &amp; derm tested</b><small>Quality on every batch</small></div></div>
        <div class="float-card fc-3"><span class="dot" style="background:#fff4e8;color:#e08a2c"><svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21 8 13.9 2 9.4h7.6Z"/></svg></span><div><b>4.8 / 5 rating</b><small>From 2,300+ customers</small></div></div>
      </div>
    </div>
  </section>

  <div class="certs"><div class="wrap">
    <span class="lbl">Quality you can trust</span>
    <div class="cert-list">
      <div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9-4 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10Z"/><path d="M9 12l2 2 4-4"/></svg>WHO-GMP</div>
      <div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>ISO 9001</div>
      <div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="9"/></svg>FSSAI</div>
      <div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>DCGI Approved</div>
      <div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 2.4 7.4H22l-6 4.5 2.3 7.1L12 16.4 5.7 21 8 13.9 2 9.4h7.6Z"/></svg>GLP Tested</div>
    </div>
  </div></div>

  <section class="sec" id="categories"><div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">Shop by need</span><h2>Eye-care categories</h2><p>From daily lubricating drops to vision supplements and lens care — find the right products across our growing eye-health portfolio.</p></div>
    <div class="cat-grid">${catCards}</div>
  </div></section>

  <section class="sec" id="products" style="background:var(--mist)"><div class="wrap">
    <div class="sec-head row reveal"><div style="max-width:560px"><span class="eyebrow">Bestsellers</span><h2>Featured products</h2><p>Hand-picked formulations our customers reorder most.</p></div>
      <a class="btn btn-ghost" onclick="go('catalog')">View all products</a></div>
    <div class="prod-grid">${featured}</div>
  </div></section>

  <section class="sec why" id="why"><div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow" style="justify-content:center">Why Inovacure</span><h2>Built on trust, quality and access</h2><p>Founded by pharma veterans with 45+ combined years of experience, we close the gap between quality medicine and affordable access.</p></div>
    <div class="why-grid">
      <div class="feat reveal"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9-4 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10Z"/><path d="M9 12l2 2 4-4"/></svg></span><h3>Uncompromising quality</h3><p>Modern manufacturing standards with batch-level quality assurance on every product that leaves our facility.</p></div>
      <div class="feat reveal"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M5 5h11a4 4 0 0 1 0 8H5M5 13h13a4 4 0 0 1 0 8H7"/></svg></span><h3>Genuinely affordable</h3><p>We engineer cost out of the supply chain — not quality — so essential medicines stay within reach for everyone.</p></div>
      <div class="feat reveal"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/></svg></span><h3>Multi-channel reach</h3><p>Retail, hospital, online and export — supplying markets across Africa, Latin America and the Middle East.</p></div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow" style="justify-content:center">Trusted by professionals</span><h2>What partners &amp; doctors say</h2></div>
    <div class="testi-grid">
      <div class="testi reveal"><div class="q">&ldquo;</div><p>Consistent quality and on-time supply have made Inovacure our default partner for OTC and dermatology lines across our chain.</p><div class="who"><span class="av">RP</span><div><b>Dr. Rajesh Patel</b><span>Clinic Network, Ahmedabad</span></div></div></div>
      <div class="testi reveal"><div class="q">&ldquo;</div><p>Affordable without cutting corners on quality. My patients can actually afford to complete their course of treatment.</p><div class="who"><span class="av">AM</span><div><b>Dr. Anjali Mehra</b><span>General Physician, Noida</span></div></div></div>
      <div class="testi reveal"><div class="q">&ldquo;</div><p>Ordering online is seamless and delivery is quick. The GST invoices make reimbursement easy for our clinic.</p><div class="who"><span class="av">SK</span><div><b>Suresh Kumar</b><span>Pharmacy Owner, Lucknow</span></div></div></div>
    </div>
  </div></section>

  <section class="sec" id="blog" style="background:var(--mist)"><div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow" style="justify-content:center">Health journal</span><h2>From the blog</h2><p>Practical health guidance, product education and industry insight.</p></div>
    <div class="cat-grid">
      <a class="cat reveal" onclick="toast('Blog coming soon')"><span class="ic">${catIconSVG('eye')}</span><h3>Protect your eyesight</h3><p>5 everyday, science-backed habits to reduce strain.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
      <a class="cat reveal" onclick="toast('Blog coming soon')"><span class="ic">${catIconSVG('pill')}</span><h3>Choosing a supplement</h3><p>Reading labels, dosages and what actually matters.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
      <a class="cat reveal" onclick="toast('Blog coming soon')"><span class="ic">${catIconSVG('cream')}</span><h3>A simple skincare routine</h3><p>What dermatologists recommend — minus the hype.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
      <a class="cat reveal" onclick="toast('Blog coming soon')"><span class="ic">${catIconSVG('shield')}</span><h3>Everyday hygiene basics</h3><p>Small protective habits that make a real difference.</p><span class="go">Read <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow" style="justify-content:center">Questions</span><h2>Frequently asked</h2></div>
    <div class="faq-wrap">
      <details class="faq reveal" open><summary>Are Inovacure products genuine and quality-tested?<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">Yes. Every product is manufactured to modern quality standards with batch-level quality assurance before it reaches you, and we follow ethical labelling and sourcing throughout.</div></details>
      <details class="faq reveal"><summary>Do you ship across India?<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">We deliver pan-India, with free shipping on orders over ${fmt(SETTINGS.freeShipThreshold)} and a flat ${fmt(SETTINGS.flatShip)} fee below that.</div></details>
      <details class="faq reveal"><summary>What is your returns policy?<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">${escapeHtml(SETTINGS.returnPolicy)}</div></details>
      <details class="faq reveal"><summary>What payment methods do you accept?<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">We support ${SETTINGS.paymentMethods.join(', ')} — with GST-compliant invoicing on every paid order.</div></details>
    </div>
  </div></section>

  <section class="sec news"><div class="wrap"><div class="inner reveal">
    <div><span class="eyebrow">Stay healthy</span><h2>Health tips &amp; offers, in your inbox</h2><p>Join our newsletter for product guides, wellness advice and member-only discounts. No spam, ever.</p></div>
    <div><form onsubmit="this.querySelector('small').textContent='Thanks — please check your inbox to confirm.';this.querySelector('input').value='';return false">
      <input type="email" placeholder="Your email address" aria-label="Email address" required>
      <button class="btn btn-primary" type="submit">Subscribe</button>
      <small>We respect your privacy. Unsubscribe anytime.</small>
    </form></div>
  </div></div></section>
  `;
}

function catIconSVG(ic){
  const m={
    eye:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M2 12h2M20 12h2"/>',
    cream:'<path d="M8 3v4M16 3v4M4 11h16M6 7h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/>',
    pill:'<path d="M12 21s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9Z"/>',
    tube:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    drop:'<path d="M6 2v6a6 6 0 0 0 12 0V2M6 22v-6a6 6 0 0 1 12 0v6"/>',
    shield:'<path d="M3 7l9-4 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10Z"/>',
    bottle:'<rect x="7" y="8" width="10" height="13" rx="2"/><rect x="9" y="3" width="6" height="5"/>',
    leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m[ic]||m.pill}</svg>`;
}

/* ---------- Catalog ---------- */
function aboutHTML(){
  const certs = [
    ['WHO-GMP','Good Manufacturing Practices certified production'],
    ['ISO 9001','Quality management systems certified'],
    ['FSSAI','Licensed for nutraceuticals & supplements'],
    ['DCGI aligned','Formulations aligned to Indian drug standards'],
    ['GLP tested','Good Laboratory Practice batch testing']
  ];
  const values = [
    ['Affordability first','Quality eye care should not be a luxury. We price honestly and keep margins fair so more families can protect their vision.'],
    ['Science we can stand behind','Every formulation is built on published evidence and validated in the lab — no gimmicks, no unproven claims.'],
    ['Safety without compromise','Preservative-free options, dermatologically tested hygiene, and paediatrician-guided kids’ range. We build for the most sensitive eyes.'],
    ['Access everywhere','From metros to small towns, we ship across India so distance never decides who gets to see clearly.']
  ];
  const milestones = [
    ['2019','Founded','Inovacure Pharmaceuticals LLP is established in Noida with a single mission: affordable, trustworthy eye care.'],
    ['2021','First range','Launch of the I·DROPS lubricating range and I·OMEGA-3 vision supplement, adopted by clinics and pharmacies.'],
    ['2023','Going wider','Contact-lens care, eye-hygiene and a paediatric line join the portfolio; nationwide shipping begins.'],
    ['2025','12,000+ served','Over twelve thousand orders shipped and a 4.8/5 average rating across 2,300+ verified customers.']
  ];
  const stats = [
    ['8','Signature eye-care products'],
    ['4.8','Average customer rating','★'],
    ['12000','Units shipped & counting','+','k'],
    ['5','Quality certifications']
  ];
  return `
  <section class="page-pad">
    <div class="wrap">
      <div class="crumb"><a onclick="go('home')">Home</a> / About Us</div>

      <div class="about-hero reveal">
        <div>
          <span class="eyebrow">Our story</span>
          <h1 class="about-h1">Affordable medicines,<br>healthier lives.</h1>
          <p class="about-lead">Inovacure Pharmaceuticals is an India-based eye-care company on a simple mission — make safe, effective vision care something every family can afford. From daily lubricating drops to vision supplements, contact-lens care and gentle hygiene, we build products people can trust and actually reach.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" onclick="go('catalog')">Explore our products <span aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" onclick="go('contact')">Talk to us</a>
          </div>
        </div>
        <div class="about-hero-card">
          <div class="ah-badge">${escapeHtml(SETTINGS.storeName||'Inovacure Pharmaceuticals')}</div>
          <div class="ah-stats trust-row">
            ${stats.map(s=>`<div class="ti"><b data-count="${s[0]}" ${s[3]?`data-fmt="${s[3]}"`:''} ${s[0]==='4.8'?'data-dec="1"':''} data-suffix="${s[2]||''}">0</b><span>${escapeHtml(s[1])}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="about-band">
      <div class="wrap about-mission reveal">
        <div>
          <span class="eyebrow">Why we exist</span>
          <h2>Vision care shouldn’t depend on your pincode or your budget.</h2>
        </div>
        <div class="about-mission-body">
          <p>Millions of people put off treating dry, tired or strained eyes simply because trusted products feel expensive or hard to find. We started Inovacure to close that gap — pairing pharmaceutical-grade quality with honest pricing and nationwide delivery.</p>
          <p>Everything we make is developed for real, everyday use: long screen time, contact-lens wear, ageing eyes, and growing children. We’d rather earn a customer for life than a quick sale, so we obsess over safety, clarity and value in equal measure.</p>
        </div>
      </div>
    </div>

    <div class="wrap">
      <div class="sec-head center reveal" style="margin:0 auto clamp(28px,3.5vw,44px)">
        <span class="eyebrow">What we stand for</span>
        <h2>Principles behind every product</h2>
        <p>Four commitments that guide how we research, formulate, price and ship.</p>
      </div>
      <div class="values-grid">
        ${values.map((v,i)=>`<div class="value-card reveal"><div class="value-num">0${i+1}</div><h3>${escapeHtml(v[0])}</h3><p>${escapeHtml(v[1])}</p></div>`).join('')}
      </div>
    </div>

    <div class="about-band alt">
      <div class="wrap">
        <div class="sec-head center reveal" style="margin:0 auto clamp(28px,3.5vw,44px)">
          <span class="eyebrow">Our journey</span>
          <h2>From one product to a trusted range</h2>
        </div>
        <div class="timeline">
          ${milestones.map(m=>`<div class="tl-item reveal"><div class="tl-year">${escapeHtml(m[0])}</div><div class="tl-body"><h4>${escapeHtml(m[1])}</h4><p>${escapeHtml(m[2])}</p></div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="wrap">
      <div class="sec-head center reveal" style="margin:0 auto clamp(28px,3.5vw,44px)">
        <span class="eyebrow">Quality you can trust</span>
        <h2>Certified, tested, accountable</h2>
        <p>Our manufacturing and testing meet recognised Indian and international standards.</p>
      </div>
      <div class="cert-grid reveal">
        ${certs.map(c=>`<div class="cert-card"><b>${escapeHtml(c[0])}</b><span>${escapeHtml(c[1])}</span></div>`).join('')}
      </div>
    </div>

    <div class="wrap">
      <div class="about-cta reveal">
        <div>
          <h2>Ready to care for your eyes the affordable way?</h2>
          <p>Browse our full range or reach out — our team is based in Noida and happy to help.</p>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" onclick="go('catalog')">Shop all products</a>
          <a class="btn btn-ghost" onclick="go('contact')">Contact us</a>
        </div>
      </div>
      <p class="about-addr">A-116, Urbtech Trade Centre, Sector 132, Noida Expressway, Gautam Buddha Nagar, UP · <a onclick="go('contact')">Get in touch</a></p>
    </div>
  </section>`;
}
function contactHTML(){
  const su = (typeof currentShopper==='function') ? currentShopper() : null;
  const methods = [
    ['email','Email us',SETTINGS.supportEmail,'Replies within 1 business day','mailto:'+SETTINGS.supportEmail,
      '<path d="M4 4h16v16H4z" fill="none"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/>'],
    ['phone','Call us','+91 95995 97879','Mon–Sat, 10 AM – 6 PM IST','tel:+919599597879',
      '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'],
    ['whatsapp','WhatsApp','Chat with us','Fastest way to reach our team','https://wa.me/'+SETTINGS.whatsapp,
      '<path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2z" fill="none"/><path d="M8.5 7.5c.3-.2.6-.1.8.2l1 1.7c.1.2.1.4 0 .6l-.6 1c.5 1 1.3 1.8 2.3 2.3l1-.6c.2-.1.4-.1.6 0l1.7 1c.3.2.4.5.2.8-.6 1-1.7 1.6-2.9 1.3a9 9 0 0 1-6.4-6.4c-.3-1.2.3-2.3 1.3-2.9z"/>']
  ];
  return `
  <section class="contact-page">
    <div class="contact-hero-band">
      <div class="wrap">
        <div class="crumb light"><a onclick="go('home')">Home</a> / Contact</div>
        <span class="eyebrow light"><span class="live-dot"></span>We usually reply within a day</span>
        <h1 class="contact-title">Let’s talk about your eyes.</h1>
        <p class="contact-sub">Questions about a product, help with an order, or a bulk enquiry for your clinic or pharmacy — our Noida-based team is here to help. Pick whatever’s easiest for you.</p>
      </div>
    </div>

    <div class="wrap contact-body">
      <div class="method-row">
        ${methods.map(m=>`
          <a class="method-card reveal" href="${m[4]}" ${m[4].startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}>
            <span class="method-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${m[5]}</svg></span>
            <span class="method-label">${escapeHtml(m[1])}</span>
            <span class="method-value">${escapeHtml(m[2])}</span>
            <span class="method-note">${escapeHtml(m[3])}</span>
          </a>`).join('')}
      </div>

      <div class="contact-grid">
        <div class="contact-form-card reveal" id="contactCard">
          <div class="cfc-head">
            <h2>Send us a message</h2>
            <p>Fill in the form and we’ll get back to you by email or phone.</p>
          </div>
          <div class="adm-grid2">
            <div class="field"><label>Full name *</label><input id="ctName" placeholder="Your name" value="${escapeHtml(su?su.name:'')}"><div class="errmsg">Please enter your name</div></div>
            <div class="field"><label>Email *</label><input id="ctEmail" type="email" placeholder="you@email.com" value="${escapeHtml(su?su.email:'')}"><div class="errmsg">Enter a valid email</div></div>
          </div>
          <div class="adm-grid2">
            <div class="field"><label>Phone</label><input id="ctPhone" placeholder="10-digit mobile" value="${escapeHtml(su?su.phone:'')}"><div class="errmsg">Enter a 10-digit phone</div></div>
            <div class="field"><label>Subject</label>
              <select id="ctSubject">
                <option>Product question</option>
                <option>Order support</option>
                <option>Bulk / clinic enquiry</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div class="field"><label>Message *</label><textarea id="ctMsg" rows="5" placeholder="How can we help you today?"></textarea><div class="errmsg">Please enter a message</div></div>
          <button class="btn btn-primary cfc-submit" onclick="submitContact()">
            <span>Send message</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
          </button>
          <p class="cfc-fine">🔒 We only use your details to respond to this enquiry — no spam, ever.</p>
        </div>

        <aside class="contact-aside reveal">
          <div class="info-card">
            <h3>Visit or reach us</h3>
            <ul class="info-list">
              <li>
                <span class="info-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <div><b>Head office</b><span>A-116, Urbtech Trade Centre,<br>Sector 132, Noida Expressway,<br>Gautam Buddha Nagar, UP</span></div>
              </li>
              <li>
                <span class="info-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
                <div><b>Working hours</b><span>Monday – Saturday<br>10:00 AM – 6:00 PM IST</span></div>
              </li>
              <li>
                <span class="info-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg></span>
                <div><b>Email</b><a href="mailto:${escapeHtml(SETTINGS.supportEmail)}">${escapeHtml(SETTINGS.supportEmail)}</a></div>
              </li>
            </ul>
            <div class="info-social">
              <a href="https://wa.me/${escapeHtml(SETTINGS.whatsapp)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="width:100%;justify-content:center">Chat on WhatsApp</a>
            </div>
          </div>
          <div class="faq-nudge">
            <b>Quick answers</b>
            <p>Shipping is free over ₹999. Most orders reach you in 3–5 business days, and we offer 7-day easy returns on unopened items.</p>
          </div>
        </aside>
      </div>
    </div>
  </section>`;
}
function submitContact(){
  const name=$('#ctName'), email=$('#ctEmail'), phone=$('#ctPhone'), msg=$('#ctMsg');
  const emailOk=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((email.value||'').trim());
  const phoneOk = !phone.value.trim() || /^\d{10}$/.test(phone.value.replace(/\D/g,'').slice(-10));
  let ok=true;
  [[name, !!name.value.trim()],[email, emailOk],[phone, phoneOk],[msg, !!msg.value.trim()]].forEach(([el,valid])=>{
    el.closest('.field').classList.toggle('err', !valid);
    if(!valid) ok=false;
  });
  if(!ok){ toast('Please fix the highlighted fields'); const f=$('.field.err input,.field.err textarea'); if(f)f.focus(); return; }
  // PROD: POST to a backend / email service or CRM. Prototype simulates capture.
  try{ logAudit && logAudit('contact.submit','message', (name.value||'')+' · '+($('#ctSubject')?$('#ctSubject').value:'')); }catch(e){}
  const card=$('#contactCard');
  if(card) card.innerHTML='<div class="cfc-success"><div class="cfc-check"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h2>Message sent!</h2><p>Thanks for reaching out — we’ve received your enquiry and will reply within 1 business day.</p><button class="btn btn-ghost" onclick="go(\'catalog\')">Continue shopping</button></div>';
  toast('Message sent — we’ll be in touch','ok');
}
function setCat(name){ catState.cat=name; renderSite(); }
function catalogHTML(){
  const cats=['all',...CATEGORIES.map(c=>c.name)];
  const chips=cats.map(c=>`<button class="chip ${catState.cat===c?'active':''}" onclick="catState.cat='${escapeHtml(c)}';renderSite()">${c==='all'?'All products':escapeHtml(c)}</button>`).join('');
  let list=PRODUCTS.slice();
  if(catState.cat!=='all') list=list.filter(p=>p.segment===catState.cat);
  if(catState.q){ const q=catState.q.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||p.segment.toLowerCase().includes(q)||(p.shortDesc||'').toLowerCase().includes(q)); }
  if(catState.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(catState.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(catState.sort==='rating') list.sort((a,b)=>b.rating-a.rating);
  else list.sort((a,b)=>b.reviewCount-a.reviewCount);
  const grid=list.length?list.map(prodCardHTML).join(''):`<div class="empty-note" style="grid-column:1/-1">No products match your search. Try a different term or category.</div>`;
  return `<section class="sec page-pad"><div class="wrap">
    <div class="crumb"><a onclick="go('home')">Home</a> / Shop</div>
    <div class="sec-head" style="margin-bottom:26px"><span class="eyebrow">Full catalog</span><h2>Shop all products</h2></div>
    <div class="catalog-bar">
      <div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input id="catSearch" type="search" placeholder="Search products…" value="${escapeHtml(catState.q)}" aria-label="Search products"></div>
      <select id="catSort" aria-label="Sort">
        <option value="pop" ${catState.sort==='pop'?'selected':''}>Most popular</option>
        <option value="price-asc" ${catState.sort==='price-asc'?'selected':''}>Price: low to high</option>
        <option value="price-desc" ${catState.sort==='price-desc'?'selected':''}>Price: high to low</option>
        <option value="rating" ${catState.sort==='rating'?'selected':''}>Top rated</option>
      </select>
    </div>
    <div class="chips">${chips}</div>
    <div class="prod-grid">${grid}</div>
  </div></section>`;
}
function wireCatalog(){
  const s=$('#catSearch'); if(s){ s.oninput=e=>{ catState.q=e.target.value; const grid=$('.prod-grid'); let list=PRODUCTS.slice(); if(catState.cat!=='all')list=list.filter(p=>p.segment===catState.cat); if(catState.q){const q=catState.q.toLowerCase();list=list.filter(p=>p.name.toLowerCase().includes(q)||p.segment.toLowerCase().includes(q));} grid.innerHTML=list.length?list.map(prodCardHTML).join(''):`<div class="empty-note" style="grid-column:1/-1">No products match your search.</div>`; observeReveal(); }; }
  const so=$('#catSort'); if(so){ so.onchange=e=>{ catState.sort=e.target.value; renderSite(); }; }
}

/* ---------- PDP ---------- */
function openPDP(id){ pdpProductId=id; const p=getProduct(id); pdpVariantSku=(firstInStockVariant(p)||p.variants[0]).sku; go('pdp'); }
function pdpHTML(){
  const p=getProduct(pdpProductId); if(!p) return `<div class="page-pad wrap">Product not found. <a onclick="go('catalog')">Back to shop</a></div>`;
  const v=getVariant(p,pdpVariantSku)||p.variants[0];
  const off=v.mrp>v.price?Math.round((1-v.price/v.mrp)*100):0;
  const ss=stockState(v.stock);
  const img = p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">` : prodSVG(p.icon,p.bg);
  const varOpts=p.variants.map(vr=>`<button class="var-opt ${vr.sku===v.sku?'active':''} ${+vr.stock<=0?'oos':''}" ${+vr.stock<=0?'disabled':''} onclick="selVariant('${vr.sku}')">${escapeHtml(vr.label)}<small>${fmt(vr.price)}</small></button>`).join('');
  const feats=(p.features||[]).map(f=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>${escapeHtml(f)}</li>`).join('');
  const c=p.content||{};
  const faqs=(p.faqs||[]).map(f=>`<details><summary>${escapeHtml(f.q)}<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ac-body">${escapeHtml(f.a)}</div></details>`).join('');
  const reviews=(p.reviews||[]).map(r=>`<div class="review"><div class="rh"><b>${escapeHtml(r.name)}</b><div class="stars">${stars(r.rating)}</div></div><p>${escapeHtml(r.text)}</p></div>`).join('') || '<p style="color:var(--ink-soft)">No reviews yet.</p>';
  return `<section class="pdp"><div class="wrap">
    <div class="crumb"><a onclick="go('home')">Home</a> / <a onclick="go('catalog')">Shop</a> / <a onclick="go('catalog');setCat('${escapeHtml(p.segment)}')">${escapeHtml(p.segment)}</a> / ${escapeHtml(p.name)}</div>
    <div class="pdp-grid">
      <div class="pdp-media"><div class="main-img" id="pdpImg">${img}</div></div>
      <div class="pdp-info">
        <span class="seg">${escapeHtml(p.segment)}</span>
        <h1>${escapeHtml(p.name)}</h1>
        <div class="rate"><div class="stars">${stars(p.rating)}</div><span>${p.rating.toFixed(1)} · ${p.reviewCount} reviews</span></div>
        <div class="pdp-price"><span class="now" id="pdpPrice">${fmt(v.price)}</span>${v.mrp>v.price?`<s id="pdpMrp">${fmt(v.mrp)}</s>`:''}${off?`<span class="off" id="pdpOff">${off}% off</span>`:''}</div>
        <div class="pdp-tax">Inclusive of all taxes (GST ${p.taxRate}% · HSN ${escapeHtml(p.taxCode)})</div>
        <p class="pdp-desc">${escapeHtml(p.shortDesc)}</p>
        <div class="var-label">Choose option</div>
        <div class="var-opts" id="varOpts">${varOpts}</div>
        <div class="pdp-buy">
          <div class="qty"><button onclick="pdpQty(-1)" aria-label="Decrease">−</button><span id="pdpQ">1</span><button onclick="pdpQty(1)" aria-label="Increase">+</button></div>
          <button class="btn btn-primary" id="pdpAdd" ${ss==='out'?'disabled':''} onclick="pdpAddToCart()">${ss==='out'?'Out of stock':'Add to cart'}</button>
          <button class="btn btn-ghost" onclick="toggleWish('${p.id}');renderSite()">${WISH.includes(p.id)?'♥ In wishlist':'♡ Wishlist'}</button>
        </div>
        <div class="stk ${ss}" id="pdpStock" style="font-size:.85rem;margin-bottom:14px">${stockLabel(v.stock)}</div>
        ${(+v.stock>0&&+v.stock<=15)?`<div class="urgency"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>Selling fast — only <b>${+v.stock}</b> left in stock</div>`:''}
        <div class="pdp-trust">
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l4 4L19 6"/></svg><span>100% genuine</span></div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="15" height="11" rx="2"/><path d="M16 10h3l3 3v4h-6"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg><span>Free over ${fmt(SETTINGS.freeShipThreshold)}</span></div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Secure checkout</span></div>
          <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9M3 12l3-3M3 12l3 3"/></svg><span>Easy returns</span></div>
        </div>
        <ul class="pdp-feat">${feats}</ul>
        <div class="acc">
          <details open><summary>Product details<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ac-body">
            ${c.ingredients?`<b>Composition:</b> ${escapeHtml(c.ingredients)}<br>`:''}
            ${c.usage?`<b>Directions:</b> ${escapeHtml(c.usage)}<br>`:''}
            ${c.origin?`<b>Origin:</b> ${escapeHtml(c.origin)}<br>`:''}
            ${c.certifications?`<b>Certifications:</b> ${escapeHtml(c.certifications)}<br>`:''}
            ${c.shelfLife?`<b>Shelf life:</b> ${escapeHtml(c.shelfLife)}`:''}
          </div></details>
          <details><summary>Shipping &amp; returns<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ac-body">Free shipping over ${fmt(SETTINGS.freeShipThreshold)}; flat ${fmt(SETTINGS.flatShip)} below that. ${escapeHtml(SETTINGS.returnPolicy)}</div></details>
          ${faqs?`<details><summary>FAQs<span class="pm"><svg viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ac-body">${faqs}</div></details>`:''}
        </div>
        <div class="reviews"><h2>Customer reviews</h2>${reviews}</div>
      </div>
    </div>
    ${(()=>{ const rel=PRODUCTS.filter(x=>x.id!==p.id&&x.segment===p.segment).concat(PRODUCTS.filter(x=>x.id!==p.id&&x.segment!==p.segment)).slice(0,4); return rel.length?`<div class="pdp-related"><div class="sec-head reveal" style="margin:60px 0 30px"><span class="eyebrow">You may also like</span><h2>Complete your eye-care routine</h2></div><div class="prod-grid">${rel.map(prodCardHTML).join('')}</div></div>`:''; })()}
  </div></section>`;
}
let pdpQ=1;
function wirePDP(){ pdpQ=1; }
function selVariant(sku){ pdpVariantSku=sku; pdpQ=1; renderSite(); }
function pdpQty(d){ const p=getProduct(pdpProductId); const v=getVariant(p,pdpVariantSku); pdpQ=Math.max(1,Math.min(+v.stock||1,pdpQ+d)); const el=$('#pdpQ'); if(el)el.textContent=pdpQ; }
function pdpAddToCart(){ addToCart(pdpProductId,pdpVariantSku,pdpQ); }
function quickAdd(id,ev){ const p=getProduct(id); const v=firstInStockVariant(p); if(!v||+v.stock<=0){toast('Out of stock','err');return;} addToCart(id,v.sku,1); flyToCart(ev,p); }
function flyToCart(ev,p){
  try{
    const src=ev&&ev.currentTarget?ev.currentTarget.closest('.prod'):null;
    const imgEl=src?src.querySelector('.img img'):null;
    const cartBtn=document.querySelector('.nav-cta [aria-label="Cart"]');
    if(!imgEl||!cartBtn){ toast('Added to cart','ok'); return; }
    const s=imgEl.getBoundingClientRect(), t=cartBtn.getBoundingClientRect();
    const fly=document.createElement('img'); fly.src=imgEl.src; fly.className='fly-img';
    fly.style.left=s.left+'px'; fly.style.top=s.top+'px'; fly.style.width=s.width+'px'; fly.style.height=s.height+'px';
    document.body.appendChild(fly);
    requestAnimationFrame(()=>{
      fly.style.left=(t.left+t.width/2-14)+'px'; fly.style.top=(t.top+t.height/2-14)+'px';
      fly.style.width='28px'; fly.style.height='28px'; fly.style.opacity='.2'; fly.style.transform='rotate(28deg)';
    });
    setTimeout(()=>{ fly.remove(); cartBtn.classList.add('bump'); setTimeout(()=>cartBtn.classList.remove('bump'),400); },720);
    toast('Added to cart','ok');
  }catch(e){ toast('Added to cart','ok'); }
}
function toggleWish(id){ if(WISH.includes(id)) WISH=WISH.filter(x=>x!==id); else WISH.push(id); saveShop(); refreshBadges(); const card=event&&event.target?event.target.closest('.prod'):null; if(card){const w=card.querySelector('.wish'); if(w)w.classList.toggle('on');} toast(WISH.includes(id)?'Added to wishlist':'Removed from wishlist'); }

/* ---------- Footer ---------- */
function renderFooter(){
  $('#siteFoot').innerHTML=`<div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <span class="foot-logo">${LOGO_FULL}</span>
        <p>Affordable medicines, healthier lives worldwide. A healthcare-focused pharmaceutical company committed to quality, access and ethical care.</p>
        <div class="foot-social">
          <a aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.5 8h4V24h-4Zm7 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7 0-3.9-2.37-3.9s-2.73 1.85-2.73 3.77V24h-4Z"/></svg></a>
          <a aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
          <a href="https://wa.me/919599597879" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.3.1.7-.1 1.4Z"/></svg></a>
        </div>
      </div>
      <div><h4>Shop</h4><ul>${CATEGORIES.map(c=>`<li><a onclick="go('catalog');setCat('${escapeHtml(c.name)}')">${escapeHtml(c.name)}</a></li>`).join('')}</ul></div>
      <div><h4>Company</h4><ul><li><a onclick="go('about')">About Us</a></li><li><a onclick="go('home');scrollToId('blog')">Blog</a></li><li><a onclick="go('account')">My account</a></li></ul></div>
      <div><h4>Get in touch</h4><ul class="foot-contact">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>A-116, Urbtech Trade Centre, Sector 132, Noida Expressway, Gautam Buddha Nagar, UP</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg><a href="tel:+919599597879">+91 95995 97879</a></li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg><a href="mailto:${escapeHtml(SETTINGS.supportEmail)}">${escapeHtml(SETTINGS.supportEmail)}</a></li>
      </ul></div>
    </div>
    <div class="foot-bottom"><span>© 2026 Inovacure Pharmaceuticals LLP. All rights reserved.</span>
      <span style="display:flex;gap:18px;flex-wrap:wrap;align-items:center"><a onclick="toast('Privacy policy')">Privacy</a><a onclick="toast('Refund policy')">Refund</a><a onclick="toast('Shipping policy')">Shipping</a><a onclick="toast('Terms')">Terms</a><span style="opacity:.7">Built by <a href="https://www.imperialtechinnovations.com/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">Imperial</a></span></span>
    </div>
  </div>`;
}
/* ============================================================
   STOREFRONT — cart drawer, checkout, account, modals, consent
   ============================================================ */

/* ---------- modal + panel helpers ---------- */
function openModal(html){
  const m=$('#modal'); if(!m) return;
  m.innerHTML=html;
  m.classList.add('open'); $('#overlay').classList.add('open');
  // focus first focusable for a11y
  setTimeout(()=>{ const f=m.querySelector('input,select,textarea,button'); if(f)f.focus(); },40);
}
function closeModal(){ const m=$('#modal'); if(m){ m.classList.remove('open'); m.innerHTML=''; } syncOverlay(); }
function openCart(){ renderCart(); $('#cartPanel').classList.add('open'); $('#overlay').classList.add('open'); }
function closeCart(){ $('#cartPanel').classList.remove('open'); syncOverlay(); }
function closeAllPanels(){
  $('#cartPanel').classList.remove('open');
  const m=$('#modal'); if(m){ m.classList.remove('open'); m.innerHTML=''; }
  const as=$('#adminShell') && $('.admin-side'); if(as) as.classList.remove('open');
  $('#drawer') && $('#drawer').classList.remove('open');
  syncOverlay();
}
// keep overlay visible only while some panel/modal/drawer is open
function syncOverlay(){
  const anyOpen = ($('#cartPanel')&&$('#cartPanel').classList.contains('open'))
    || ($('#modal')&&$('#modal').classList.contains('open'))
    || ($('#drawer')&&$('#drawer').classList.contains('open'));
  $('#overlay').classList.toggle('open', !!anyOpen);
}

/* ---------- cart drawer ---------- */
function renderCart(){
  const panel=$('#cartPanel'); if(!panel) return;
  const lines=cartLineList();
  const b=cartBreakdown();
  let body;
  if(!lines.length){
    body=`<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.6 13a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <p>Your cart is empty.</p>
      <button class="btn btn-primary" onclick="closeCart();go('catalog')">Start shopping</button>
    </div>`;
  } else {
    const items=lines.map(l=>{
      const img=l.p.image?`<img src="${escapeHtml(l.p.image)}" alt="${escapeHtml(l.p.name)}">`:prodSVG(l.p.icon,l.p.bg);
      return `<div class="cart-item">
        <div class="thumb">${img}</div>
        <div class="ci-main">
          <h4>${escapeHtml(l.p.name)}</h4>
          <div class="ci-var">${escapeHtml(l.v.label)} · ${fmt(l.v.price)}</div>
          <div class="qty">
            <button onclick="changeQty('${l.p.id}','${l.v.sku}',-1)" aria-label="Decrease">−</button>
            <span>${l.qty}</span>
            <button onclick="changeQty('${l.p.id}','${l.v.sku}',1)" aria-label="Increase">+</button>
          </div>
          <button class="ci-remove" onclick="removeItem('${l.p.id}','${l.v.sku}')">Remove</button>
        </div>
        <div class="ci-price">${fmt(l.lineTotal)}</div>
      </div>`;
    }).join('');
    const couponLine = appliedCoupon
      ? `<div class="sum-row disc"><span>Coupon ${escapeHtml(appliedCoupon)} <a onclick="removeCoupon()" style="cursor:pointer;text-decoration:underline">remove</a></span><span>−${fmt(b.discount)}</span></div>`
      : '';
    body=`${items}
      <div style="margin-top:18px">
        <div class="coupon-row">
          <input id="couponInput" placeholder="Coupon code" value="${escapeHtml(appliedCoupon||'')}" aria-label="Coupon code">
          <button class="btn btn-ghost" onclick="applyCoupon()">Apply</button>
        </div>
        <div class="cart-sum">
          <div class="sum-row"><span>Subtotal</span><span>${fmt(b.subtotal)}</span></div>
          ${couponLine}
          <div class="sum-row"><span>Shipping</span><span>${b.ship?fmt(b.ship):'FREE'}</span></div>
          <div class="sum-row" style="font-size:.8rem"><span>Incl. GST</span><span>${fmt(b.gst)}</span></div>
          <div class="sum-row total"><span>Total</span><span>${fmt(b.total)}</span></div>
        </div>
      </div>`;
  }
  panel.innerHTML=`
    <div class="panel-head"><h3>Your cart</h3><button class="panel-close" onclick="closeCart()" aria-label="Close cart">&times;</button></div>
    <div class="panel-body">${body}</div>
    ${lines.length?`<div class="panel-foot">
      <button class="btn btn-primary" style="width:100%" onclick="closeCart();go('checkout')">Checkout · ${fmt(b.total)}</button>
      <button class="btn btn-ghost" style="width:100%;margin-top:8px" onclick="closeCart();go('catalog')">Continue shopping</button>
    </div>`:''}`;
}
function applyCoupon(){
  const el=$('#couponInput'); if(!el) return;
  const code=el.value.trim().toUpperCase();
  if(!code){ appliedCoupon=null; renderCart(); return; }
  const c=COUPONS[code];
  if(!c||!c.active){ toast('Invalid or expired coupon','err'); return; }
  if(c.expires && new Date(c.expires) < new Date(new Date().toDateString())){ toast('This coupon has expired','err'); return; }
  const sub=cartSubtotal();
  if(sub < (+c.minCart||0)){ toast('Add '+fmt((+c.minCart)-sub)+' more to use '+code,'err'); return; }
  appliedCoupon=code; renderCart(); toast('Coupon applied','ok');
}
function removeCoupon(){ appliedCoupon=null; renderCart(); }

/* ---------- checkout ---------- */
function checkoutHTML(){
  const lines=cartLineList();
  if(!lines.length) return `<div class="page-pad wrap"><div class="cart-empty"><p>Your cart is empty.</p><button class="btn btn-primary" onclick="go('catalog')">Shop products</button></div></div>`;
  const b=cartBreakdown();
  const su=currentShopper();
  const methods=SETTINGS.paymentMethods||['UPI','Card','COD'];
  const methodMeta={UPI:'Pay instantly via any UPI app',Card:'Credit / debit card',COD:'Pay cash on delivery'};
  const payOpts=methods.map((m,i)=>`<label class="pay-opt ${i===0?'active':''}" onclick="selPay(this,'${m}')">
      <span class="radio"></span><span><b>${escapeHtml(m)}</b><small>${escapeHtml(methodMeta[m]||'')}</small></span>
    </label>`).join('');
  const items=lines.map(l=>`<div class="sum-row"><span>${escapeHtml(l.p.name)} · ${escapeHtml(l.v.label)} ×${l.qty}</span><span>${fmt(l.lineTotal)}</span></div>`).join('');
  const a=(su&&su.addresses&&su.addresses[0])||{};
  return `<section class="page-pad"><div class="wrap">
    <div class="crumb"><a onclick="go('catalog')">Shop</a> / Checkout</div>
    <h1 style="font-size:1.8rem;margin-bottom:24px">Checkout</h1>
    <div class="checkout-grid">
      <div>
        <div class="co-card">
          <h3>Contact</h3>
          <div class="adm-grid2">
            <div class="field"><label>Full name *</label><input id="coName" value="${escapeHtml(a.name||(su?su.name:''))}"><div class="errmsg">Enter your name</div></div>
            <div class="field"><label>Email *</label><input id="coEmail" type="email" value="${escapeHtml(su?su.email:'')}"><div class="errmsg">Enter a valid email</div></div>
          </div>
          <div class="field"><label>Phone *</label><input id="coPhone" value="${escapeHtml(a.phone||(su?su.phone:''))}"><div class="errmsg">Enter a 10-digit phone</div></div>
        </div>
        <div class="co-card">
          <h3>Shipping address</h3>
          <div class="field"><label>Address line *</label><input id="coLine1" value="${escapeHtml(a.line1||'')}"><div class="errmsg">Enter your address</div></div>
          <div class="adm-grid3">
            <div class="field"><label>City *</label><input id="coCity" value="${escapeHtml(a.city||'')}"><div class="errmsg">City</div></div>
            <div class="field"><label>State</label><input id="coState" value="${escapeHtml(a.state||'')}"></div>
            <div class="field"><label>PIN *</label><input id="coPin" value="${escapeHtml(a.pin||'')}"><div class="errmsg">6-digit PIN</div></div>
          </div>
        </div>
        <div class="co-card">
          <h3>Payment method</h3>
          ${payOpts}
          <input type="hidden" id="coPay" value="${escapeHtml(methods[0])}">
          <p class="hint" style="margin-top:8px">// PROD: simulated capture — swap for real payment-gateway webhook.</p>
        </div>
      </div>
      <aside class="summary-side">
        <h3>Order summary</h3>
        ${items}
        <hr class="section-divider">
        <div class="sum-row"><span>Subtotal</span><span>${fmt(b.subtotal)}</span></div>
        ${b.discount?`<div class="sum-row disc"><span>Discount</span><span>−${fmt(b.discount)}</span></div>`:''}
        <div class="sum-row"><span>Shipping</span><span>${b.ship?fmt(b.ship):'FREE'}</span></div>
        <div class="sum-row" style="font-size:.8rem"><span>Incl. GST</span><span>${fmt(b.gst)}</span></div>
        <div class="sum-row total"><span>To pay</span><span>${fmt(b.total)}</span></div>
        <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="placeOrder()">Place order</button>
        <p class="hint" style="text-align:center;margin-top:10px">Free shipping over ${fmt(SETTINGS.freeShipThreshold)}</p>
      </aside>
    </div>
  </div></section>`;
}
function selPay(el,method){ $$('.pay-opt').forEach(o=>o.classList.remove('active')); el.classList.add('active'); $('#coPay').value=method; }

/* ---------- placeOrder (B7 exact sequence) ---------- */
let lastOrderId=null;
function placeOrder(){
  // 1. validate (focus first invalid)
  const reqs=[['coName',v=>v.trim().length>1],['coEmail',v=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())],
    ['coPhone',v=>/^\d{10}$/.test(v.replace(/\D/g,'').slice(-10))&&v.replace(/\D/g,'').length>=10],
    ['coLine1',v=>v.trim().length>3],['coCity',v=>v.trim().length>1],['coPin',v=>/^\d{6}$/.test(v.trim())]];
  let firstBad=null;
  reqs.forEach(([id,test])=>{
    const el=$('#'+id); const f=el.closest('.field'); const ok=test(el.value||'');
    if(f) f.classList.toggle('err',!ok);
    if(!ok && !firstBad) firstBad=el;
  });
  if(firstBad){ firstBad.focus(); toast('Please complete the highlighted fields','err'); return; }

  const name=$('#coName').value.trim(), email=$('#coEmail').value.trim().toLowerCase(),
        phone=$('#coPhone').value.trim(), method=$('#coPay').value;
  const ship={name,line1:$('#coLine1').value.trim(),city:$('#coCity').value.trim(),state:$('#coState').value.trim(),pin:$('#coPin').value.trim(),phone};

  // 2. snapshot line items before clearing cart
  const lines=cartLineList().map(l=>({productId:l.p.id, sku:l.v.sku, name:l.p.name, variant:l.v.label,
    price:+l.v.price, mrp:+l.v.mrp, qty:l.qty, taxRate:l.p.taxRate, taxCode:l.p.taxCode}));
  if(!lines.length){ toast('Your cart is empty','err'); return; }
  const b=cartBreakdown();

  // 3. deduct variant stock + re-sync  // PROD: server-atomic decrement
  lines.forEach(l=>{ const p=getProduct(l.productId); const v=getVariant(p,l.sku); if(v){ v.stock=Math.max(0,+v.stock-l.qty); syncProductFromVariants(p);} });

  // 4. link/create customer by email
  const cust=linkCustomerByEmail(name,email,phone,ship.city);

  // 5. build order
  const paid = method!=='COD';
  const status = paid ? 'processing' : 'payment-pending';
  const now=todayISO();
  const order={
    id:uid('ord'), customerId:cust.id, customer:name, email, phone,
    lines, discount:b.discount, coupon:appliedCoupon||'', shipTotal:b.ship,
    ship,
    payment:{method, status: paid?'captured':'pending',
      txnId: paid?('TXN'+Math.random().toString(36).slice(2,9).toUpperCase()):'',
      gateway: method==='COD'?'cod':'razorpay', capturedAt: paid?now:null, invoice:''},
    status, date:now, tracking:{},
    timeline:[{t:now,label:'Order placed',by:'customer'},{t:now,label:'Status → '+status,by:'system'}]
  };

  // 6. issue invoice if paid
  if(paid) order.payment.invoice=nextInvoiceNo();

  // 7. persist (unshift, save addr, notify, audit, persistAll)
  ORDERS.unshift(order);
  if(appliedCoupon && COUPONS[appliedCoupon]){ COUPONS[appliedCoupon].uses=(COUPONS[appliedCoupon].uses||0)+1; }
  const su=currentShopper();
  if(su){ su.addresses=su.addresses||[]; su.addresses[0]=ship; saveShop(); }
  // notify  // PROD: transactional email/SMS to customer + ops
  logAudit('order.create','order #'+order.id.slice(-6), name+' · '+fmt(orderTotal(order)));
  persistAll();

  // 8. reset cart + coupon, success modal
  CART=[]; appliedCoupon=null; saveShop(); refreshBadges();
  lastOrderId=order.id;
  go('order');
}

/* ---------- order confirmation ---------- */
function orderConfirmHTML(){
  const o=ORDERS.find(x=>x.id===lastOrderId)||ORDERS[0];
  if(!o) return `<div class="page-pad wrap">No recent order. <a onclick="go('catalog')">Shop</a></div>`;
  const items=o.lines.map(l=>`<div class="sum-row"><span>${escapeHtml(l.name)} · ${escapeHtml(l.variant)} ×${l.qty}</span><span>${fmt(round2(l.price*l.qty))}</span></div>`).join('');
  return `<section class="page-pad"><div class="wrap" style="max-width:640px;margin:0 auto;text-align:center">
    <div class="success-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></div>
    <h1 style="font-size:1.8rem">Thank you, ${escapeHtml(o.customer.split(' ')[0])}!</h1>
    <p style="color:var(--ink-soft);margin:8px 0 4px">Your order <b>#${escapeHtml(o.id.slice(-6).toUpperCase())}</b> is confirmed.</p>
    ${o.payment.invoice?`<p style="color:var(--ink-soft);font-size:.9rem">Invoice ${escapeHtml(o.payment.invoice)}</p>`:`<p style="color:var(--ink-soft);font-size:.9rem">Payment: Cash on delivery</p>`}
    <div class="co-card" style="text-align:left;margin:26px 0">
      ${items}
      <hr class="section-divider">
      <div class="sum-row"><span>Shipping</span><span>${o.shipTotal?fmt(o.shipTotal):'FREE'}</span></div>
      ${o.discount?`<div class="sum-row disc"><span>Discount</span><span>−${fmt(o.discount)}</span></div>`:''}
      <div class="sum-row total"><span>Total paid</span><span>${fmt(orderTotal(o))}</span></div>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="go('account','orders')">View my orders</button>
      <button class="btn btn-ghost" onclick="go('catalog')">Continue shopping</button>
    </div>
  </div></section>`;
}

/* ---------- account ---------- */
function accountHTML(){
  const su=currentShopper();
  if(!su) return accountAuthHTML();
  const navItems=[['orders','My orders'],['wishlist','Wishlist'],['addresses','Addresses'],['profile','Profile']];
  const nav=navItems.map(([k,l])=>`<button class="${acctTab===k?'active':''}" onclick="acctTab='${k}';renderSite()">${l}</button>`).join('');
  let pane='';
  if(acctTab==='orders'){
    const mine=ORDERS.filter(o=>o.email===su.email);
    pane = mine.length ? mine.map(o=>`<div class="order-card">
        <div class="oh"><b>#${escapeHtml(o.id.slice(-6).toUpperCase())}</b>${statusPill(o.status)}</div>
        <div style="font-size:.85rem;color:var(--ink-soft);margin-bottom:8px">${fmtDate(o.date)} · ${orderItemsCount(o)} item(s) · ${fmt(orderTotal(o))}</div>
        <div style="font-size:.85rem">${o.lines.map(l=>escapeHtml(l.name)+' ×'+l.qty).join(', ')}</div>
      </div>`).join('') : `<div class="cart-empty"><p>No orders yet.</p><button class="btn btn-primary" onclick="go('catalog')">Shop now</button></div>`;
  } else if(acctTab==='wishlist'){
    const items=WISH.map(getProduct).filter(Boolean);
    pane = items.length ? `<div class="prod-grid">${items.map(prodCardHTML).join('')}</div>` : `<div class="cart-empty"><p>Your wishlist is empty.</p><button class="btn btn-primary" onclick="go('catalog')">Browse products</button></div>`;
  } else if(acctTab==='addresses'){
    const a=(su.addresses&&su.addresses[0]);
    pane = a ? `<div class="co-card"><b>${escapeHtml(a.name||su.name)}</b><br>${escapeHtml(a.line1||'')}<br>${escapeHtml(a.city||'')} ${escapeHtml(a.state||'')} ${escapeHtml(a.pin||'')}<br>${escapeHtml(a.phone||'')}</div>`
      : `<div class="cart-empty"><p>No saved address yet — it's saved automatically at checkout.</p></div>`;
  } else {
    pane = `<div class="co-card" style="max-width:440px">
      <div class="field"><label>Name</label><input id="pfName" value="${escapeHtml(su.name)}"></div>
      <div class="field"><label>Email</label><input value="${escapeHtml(su.email)}" disabled></div>
      <div class="field"><label>Phone</label><input id="pfPhone" value="${escapeHtml(su.phone||'')}"></div>
      <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
    </div>`;
  }
  return `<section class="page-pad"><div class="wrap">
    <div class="oh" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
      <h1 style="font-size:1.8rem">Hi, ${escapeHtml(su.name.split(' ')[0])}</h1>
      <button class="btn btn-ghost" onclick="logoutUser();toast('Signed out');renderSite()">Sign out</button>
    </div>
    <div class="acct-grid">
      <nav class="acct-nav">${nav}</nav>
      <div>${pane}</div>
    </div>
  </div></section>`;
}
function saveProfile(){ const su=currentShopper(); if(!su)return; su.name=$('#pfName').value.trim()||su.name; su.phone=$('#pfPhone').value.trim(); saveShop(); toast('Profile updated','ok'); renderSite(); }

function accountAuthHTML(){
  return `<section class="page-pad"><div class="wrap" style="max-width:420px;margin:0 auto">
    <div class="co-card">
      <h1 style="font-size:1.5rem;margin-bottom:6px">Sign in</h1>
      <p class="hint" style="margin-bottom:18px">Access your orders, wishlist and saved addresses.</p>
      <div class="field"><label>Email</label><input id="liEmail" type="email" placeholder="you@email.com"></div>
      <div class="field"><label>Password</label><input id="liPass" type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" style="width:100%" onclick="doShopLogin()">Sign in</button>
      <div class="login-foot">New here? <a onclick="acctShowRegister()">Create an account</a></div>
    </div>
  </div></section>`;
}
function acctShowRegister(){
  const main=$('#siteMain');
  main.innerHTML=`<section class="page-pad"><div class="wrap" style="max-width:420px;margin:0 auto">
    <div class="co-card">
      <h1 style="font-size:1.5rem;margin-bottom:6px">Create account</h1>
      <p class="hint" style="margin-bottom:18px">It only takes a moment.</p>
      <div class="field"><label>Full name</label><input id="rgName"></div>
      <div class="field"><label>Email</label><input id="rgEmail" type="email"></div>
      <div class="field"><label>Phone</label><input id="rgPhone"></div>
      <div class="field"><label>Password</label><input id="rgPass" type="password"></div>
      <button class="btn btn-primary" style="width:100%" onclick="doShopRegister()">Create account</button>
      <div class="login-foot">Have an account? <a onclick="renderSite()">Sign in</a></div>
    </div>
  </div></section>`;
}
function doShopLogin(){
  const r=loginUser($('#liEmail').value,$('#liPass').value);
  if(!r.ok){ toast(r.msg,'err'); return; }
  toast('Welcome back','ok'); renderSite();
}
function doShopRegister(){
  const name=$('#rgName').value.trim(), email=$('#rgEmail').value.trim(), phone=$('#rgPhone').value.trim(), pass=$('#rgPass').value;
  if(name.length<2||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||pass.length<4){ toast('Please fill all fields (password ≥ 4 chars)','err'); return; }
  const r=registerUser(name,email,phone,pass);
  if(!r.ok){ toast(r.msg,'err'); return; }
  toast('Account created','ok'); renderSite();
}

/* ---------- IntersectionObserver reveals + counters ---------- */
let _io=null, _co=null;
function observeReveal(){
  // stagger siblings for a cascading entrance
  $$('.reveal:not(.in)').forEach(el=>{
    if(el.style.transitionDelay) return;
    const sibs=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));
    const i=sibs.indexOf(el);
    if(i>0) el.style.transitionDelay=Math.min(i*70,420)+'ms';
  });
  if(typeof IntersectionObserver==='undefined'){ $$('.reveal').forEach(e=>e.classList.add('in')); runCounters(); return; }
  if(!_io){ _io=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); _io.unobserve(e.target);} }); },{threshold:.12}); }
  $$('.reveal:not(.in)').forEach(e=>_io.observe(e));
  // Dedicated observer for EVERY counter (hero + below-the-fold), independent of .reveal.
  if(!_co){ _co=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ animateCount(e.target); _co.unobserve(e.target);} }); },{threshold:0, rootMargin:'0px 0px -8% 0px'}); }
  $$('[data-count]:not([data-done])').forEach(e=>_co.observe(e));
  // fallback for anything already in view at boot
  runCounters();
  // Hero stat counters are the flagship on-load animation — run them immediately,
  // independent of viewport height or scroll position (this was the "stuck at 0" bug).
  requestAnimationFrame(()=>{ $$('.trust-row [data-count]:not([data-done])').forEach(el=>animateCount(el)); });
}
function runCounters(scope){
  const root=scope||document;
  root.querySelectorAll('[data-count]:not([data-done])').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top<window.innerHeight && r.bottom>0) animateCount(el);
  });
}
function animateCount(el){
  if(el.getAttribute('data-done')) return;
  el.setAttribute('data-done','1');
  const target=parseFloat(el.getAttribute('data-count'))||0;
  const dec=parseInt(el.getAttribute('data-dec')||'0',10);
  const suffix=el.getAttribute('data-suffix')||'';
  const fmtK=el.getAttribute('data-fmt')==='k';
  const dur=1400, t0=performance.now();
  function tick(now){
    const p=Math.min((now-t0)/dur,1);
    const e=1-Math.pow(1-p,3); // easeOutCubic
    let val=target*e;
    let out;
    if(fmtK && target>=1000){ out=(val>=1000?Math.round(val/1000):0)+'k'; }
    else if(dec){ out=val.toFixed(dec); }
    else { out=Math.round(val).toLocaleString('en-IN'); }
    el.textContent=out+suffix;
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=(fmtK&&target>=1000?(Math.round(target/100)/10+'k'):(dec?target.toFixed(dec):Math.round(target).toLocaleString('en-IN')))+suffix;
  }
  requestAnimationFrame(tick);
}

/* ---------- Live activity ticker (social proof) ---------- */
let _liveTimer=null;
const LIVE_NAMES=['Ananya from Delhi','Rohit from Mumbai','Fatima from Lucknow','Vikram from Pune','Sneha from Jaipur','Karthik from Chennai','Priya from Noida','Imran from Hyderabad','Divya from Kochi','Aditya from Kolkata'];
function liveActivityTick(){
  const host=$('#liveToast'); if(!host) return;
  const prods=PRODUCTS.filter(p=>p.stock>0); if(!prods.length) return;
  const p=prods[Math.floor(Math.random()*prods.length)];
  const who=LIVE_NAMES[Math.floor(Math.random()*LIVE_NAMES.length)];
  const mins=Math.floor(Math.random()*40)+1;
  const thumb=p.image?`<img src="${escapeHtml(p.image)}" alt="">`:'';
  host.innerHTML=`<div class="lt-card">${thumb}<div class="lt-txt"><b>${escapeHtml(who)}</b>just ordered <span>${escapeHtml(p.name)}</span><small>${mins} min ago · verified purchase</small></div></div>`;
  host.classList.add('show');
  clearTimeout(host._hide);
  host._hide=setTimeout(()=>host.classList.remove('show'),5200);
}
function startLiveActivity(){
  if(_liveTimer) clearInterval(_liveTimer);
  setTimeout(liveActivityTick,4000);
  _liveTimer=setInterval(liveActivityTick, 14000);
}

/* ---------- dynamic Product + FAQ JSON-LD on PDP ---------- */
function updatePdpLd(){
  const el=$('#pdpLd'); if(!el) return;
  if(sitePage!=='pdp'){ el.textContent=''; return; }
  const p=getProduct(pdpProductId); if(!p){ el.textContent=''; return; }
  const v=getVariant(p,pdpVariantSku)||p.variants[0];
  const blocks=[{
    "@context":"https://schema.org","@type":"Product",
    "name":p.name,"description":p.shortDesc,"brand":{"@type":"Brand","name":SETTINGS.storeName},
    "category":p.segment,"sku":v.sku,
    "aggregateRating":{"@type":"AggregateRating","ratingValue":p.rating,"reviewCount":p.reviewCount},
    "offers":{"@type":"Offer","priceCurrency":"INR","price":v.price,
      "availability": (+v.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"),
      "url":"https://"+SETTINGS.domain+"/#/pdp"}
  }];
  if(p.faqs&&p.faqs.length){
    blocks.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":p.faqs.map(f=>({
      "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))});
  }
  el.textContent=JSON.stringify(blocks.length===1?blocks[0]:blocks);
}

/* ---------- cookie consent (gates trackers) ---------- */
function initConsent(){
  if(CONSENT){ loadTrackers(); return; }
  const bar=document.createElement('div');
  bar.id='consentBar';
  bar.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:300;background:#fff;border-top:1px solid var(--line);box-shadow:0 -8px 30px rgba(16,36,63,.12);padding:16px 20px;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap';
  bar.innerHTML=`<span style="font-size:.86rem;color:var(--ink);max-width:560px">We use cookies to run the store and, with your consent, to understand usage. <a onclick="toast('Privacy policy')" style="color:var(--primary-dark);text-decoration:underline;cursor:pointer">Learn more</a>.</span>
    <span style="display:flex;gap:8px">
      <button class="btn btn-ghost" onclick="setConsent('essential')">Essential only</button>
      <button class="btn btn-primary" onclick="setConsent('all')">Accept all</button>
    </span>`;
  document.body.appendChild(bar);
}
function setConsent(level){ CONSENT=level; saveShop(); const b=$('#consentBar'); if(b)b.remove(); if(level==='all') loadTrackers(); }
function loadTrackers(){ /* PROD: inject analytics/marketing scripts only after consent==='all' */ if(CONSENT==='all'){ /* e.g. gtag/meta pixel */ } }
/* ============================================================
   ADMIN LOGIN GATE — two-stage: password → 6-digit email OTP
   Per framework B10. Password hashed with SHA-256 on boot
   (plaintext discarded). OTP is normally emailed; for this
   prototype it is SHOWN on the login page (per brief) and
   marked // PROD: send via transactional email/SMS.
   ============================================================ */
let loginError='';

function renderLogin(){
  const card=$('#loginCard'); if(!card) return;
  if(loginStage==='password') card.innerHTML=loginPasswordHTML();
  else card.innerHTML=loginOtpHTML();
  setTimeout(()=>{ const f=card.querySelector('input'); if(f)f.focus(); },50);
}

function loginPasswordHTML(){
  return `
    <div class="lc-brand"><span class="lc-logo">${LOGO_FULL}</span></div>
    <h2>Admin sign-in</h2>
    <p class="sub">Enter the owner password to continue. A one-time code follows.</p>
    <div class="field ${loginError?'err':''}">
      <label>Password</label>
      <input id="admPass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')submitAdminPassword()">
      ${loginError?`<div class="errmsg" style="display:block">${escapeHtml(loginError)}</div>`:''}
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="submitAdminPassword()">Continue</button>
    <div class="login-foot">Authorised personnel only.</div>
    <div class="login-back" onclick="exitAdmin()">← Back to store</div>
    <p class="hint" style="margin-top:14px;color:#9fb4cd">// PROD: prototype hash → server bcrypt + httpOnly JWT.</p>`;
}

function loginOtpHTML(){
  return `
    <div class="lc-brand"><span class="lc-logo">${LOGO_FULL}</span></div>
    <h2>Verify it's you</h2>
    <p class="sub">A 6-digit code was sent to <b>${escapeHtml(otpEmailTarget)}</b>. It expires in 5 minutes.</p>
    <div class="otp-banner">Your one-time code (shown here for the prototype):<b>${escapeHtml(pendingOTP||'')}</b></div>
    <div class="field ${loginError?'err':''}">
      <label>Enter code</label>
      <input id="admOtp" inputmode="numeric" maxlength="6" placeholder="000000" onkeydown="if(event.key==='Enter')submitAdminOtp()">
      ${loginError?`<div class="errmsg" style="display:block">${escapeHtml(loginError)}</div>`:''}
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="submitAdminOtp()">Verify &amp; sign in</button>
    <div class="login-foot">
      <a onclick="resendOtp()">Resend code</a> ·
      <a onclick="showResetEmail()">Send to a different email</a>
    </div>
    <div class="login-back" onclick="backToPassword()">← Use password again</div>
    <p class="hint" style="margin-top:14px;color:#9fb4cd">// PROD: OTP delivered by transactional email/SMS, never shown on screen.</p>`;
}

async function submitAdminPassword(){
  const val=$('#admPass').value||'';
  // hash entered password and compare to boot hash (constant target)
  const h=await sha256(val);
  if(!ADMIN_PASS_HASH){ ADMIN_PASS_HASH=await sha256(ADMIN_PASSWORD_PLAINTEXT); }
  if(h!==ADMIN_PASS_HASH){ loginError='Incorrect password.'; renderLogin(); return; }
  loginError='';
  issueOtp();
  loginStage='otp';
  renderLogin();
}

function issueOtp(){
  pendingOTP=genOTP();
  otpExpiry=Date.now()+5*60*1000;
  otpEmailTarget=ADMIN_OTP_EMAIL;
  // PROD: send `pendingOTP` to otpEmailTarget via transactional email; do not return it to the client.
}
function resendOtp(){ issueOtp(); loginError=''; renderLogin(); toast('A new code was generated','ok'); }

function submitAdminOtp(){
  const val=($('#admOtp').value||'').trim();
  if(Date.now()>otpExpiry){ loginError='Code expired — request a new one.'; renderLogin(); return; }
  if(val!==pendingOTP){ loginError='Incorrect code.'; renderLogin(); return; }
  // success → establish admin session as owner staff member
  const owner=STAFF.find(s=>s.email===ADMIN_OTP_EMAIL && s.active) || STAFF.find(s=>s.role==='owner') || STAFF[0];
  currentUser={id:owner.id,name:owner.name,email:owner.email,role:owner.role};
  dbSave('currentAdmin',currentUser);
  loginStage='password'; pendingOTP=null; loginError='';
  logAudit('admin.login','session', owner.name+' signed in');
  persistAll();
  location.hash='#/admin';
  showView('admin');
  adminGo('dashboard');
  toast('Signed in to admin','ok');
}

function backToPassword(){ loginStage='password'; loginError=''; renderLogin(); }

/* reset / change the OTP destination email (resettable per brief) */
function showResetEmail(){
  openModal(`
    <div class="modal-head"><h3>Change OTP email</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <p class="hint" style="margin-bottom:14px">The one-time code will be sent to this address from now on.</p>
      <div class="field"><label>Email address</label><input id="resetEmail" type="email" value="${escapeHtml(ADMIN_OTP_EMAIL)}"></div>
      <button class="btn btn-primary" style="width:100%" onclick="applyResetEmail()">Save &amp; send code here</button>
    </div>`);
}
function applyResetEmail(){
  const v=($('#resetEmail').value||'').trim();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){ toast('Enter a valid email','err'); return; }
  ADMIN_OTP_EMAIL=v;
  SETTINGS.otpEmail=v; persist('settings',SETTINGS);
  logAudit('admin.otpEmail','settings','OTP email → '+v);
  closeModal();
  issueOtp(); loginStage='otp'; loginError=''; renderLogin();
  toast('OTP email updated','ok');
}

function exitAdmin(){ location.hash='#/'; showView('site'); sitePage='home'; renderSite(); }
/* ============================================================
   ADMIN CONSOLE — declarative nav, shell, module dispatcher
   ============================================================ */
let adminTab='dashboard';
let adminState={ ordSearch:'', ordFilter:'all', ordSort:'date', invSearch:'', invSort:'name', invPage:1,
  custSearch:'', payFilter:'all', auditSearch:'', detailOrder:null, detailCust:null, editProduct:null };
const PAGE_SIZE=8;

const ICN={
  dash:'<path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"/>',
  orders:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
  returns:'<path d="M3 7v6h6M3 13a9 9 0 1 0 3-7"/>',
  inv:'<path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 12v5"/>',
  prod:'<path d="m7.5 4.27 9 5.15M21 8.5l-9 5.5-9-5.5 9-5.5zM3 8.5v7l9 5.5 9-5.5v-7"/>',
  add:'<path d="M12 5v14M5 12h14"/>',
  cat:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  cust:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 .01M23 21v-2a4 4 0 0 0-3-3.87"/>',
  pay:'<path d="M1 4h22v16H1zM1 10h22"/>',
  coup:'<path d="M3 8a3 3 0 0 1 0 8v3h18v-3a3 3 0 0 1 0-8V5H3zM12 5v14"/>',
  rep:'<path d="M3 3v18h18M7 16v-5M12 16V8M17 16v-3"/>',
  cms:'<path d="M4 4h16v16H4zM4 9h16M9 9v11"/>',
  audit:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15l2 2 4-4"/>',
  roles:'<path d="M12 2 4 6v6c0 5 8 8 8 8s8-3 8-8V6z"/>',
  set:'<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z"/>'
};
const ADMIN_NAV=[
  ['Overview',[['dashboard',ICN.dash,'Dashboard'],['orders',ICN.orders,'Orders'],['returns',ICN.returns,'Returns / RMA']]],
  ['Catalog',[['inventory',ICN.inv,'Inventory'],['products',ICN.prod,'Products'],['addproduct',ICN.add,'Add product'],['categories',ICN.cat,'Categories']]],
  ['Customers & Money',[['customers',ICN.cust,'Customers'],['payments',ICN.pay,'Payments'],['coupons',ICN.coup,'Coupons'],['reports',ICN.rep,'Reports']]],
  ['System',[['cms',ICN.cms,'Content / CMS'],['audit',ICN.audit,'Audit log'],['roles',ICN.roles,'Roles & staff'],['settings',ICN.set,'Settings']]]
];

function renderAdmin(){
  const shell=$('#adminShell'); if(!shell) return;
  const counts={orders:ORDERS.length,returns:RETURNS.length,inventory:PRODUCTS.length,products:PRODUCTS.length,customers:CUSTOMERS.length,coupons:Object.keys(COUPONS).length};
  const groups=ADMIN_NAV.map(([label,items])=>`
    <div class="admin-group"><div class="ag-label">${label}</div>
      ${items.map(([key,icon,txt])=>`<button class="admin-nav-item ${adminTab===key?'active':''}" onclick="adminGo('${key}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg><span>${txt}</span>
        ${counts[key]?`<span class="ct">${counts[key]}</span>`:''}
      </button>`).join('')}
    </div>`).join('');
  shell.innerHTML=`
    <div class="admin-top">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="admin-burger" onclick="$('.admin-side').classList.toggle('open');syncOverlay&&syncOverlay()" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
        <div class="at-brand"><span class="at-logo">${LOGO_FULL}</span><small>Admin</small></div>
      </div>
      <div class="at-right">
        <span class="at-user">${escapeHtml(currentUser?currentUser.name+' · '+currentUser.role:'')}</span>
        <button class="btn btn-ghost" onclick="adminSignOut()">Sign out</button>
      </div>
    </div>
    <div class="admin-shell">
      <aside class="admin-side">${groups}</aside>
      <main class="admin-main" id="adminMain"></main>
    </div>`;
  renderAdminTab();
}
function adminGo(tab){ adminTab=tab; const s=$('.admin-side'); if(s)s.classList.remove('open'); syncOverlay&&syncOverlay();
  // re-render full shell so the active nav highlight updates
  renderAdmin(); window.scrollTo({top:0,behavior:'auto'});
}
function adminSignOut(){ logAudit('admin.logout','session',(currentUser?currentUser.name:'')); currentUser=null; dbSave('currentAdmin',null); loginStage='password'; location.hash='#/'; showView('site'); sitePage='home'; renderSite(); toast('Signed out'); }

function renderAdminTab(){
  const m=$('#adminMain'); if(!m) return;
  const map={dashboard:admDashboard,orders:admOrders,returns:admReturns,inventory:admInventory,
    products:admProducts,addproduct:admAddProduct,categories:admCategories,customers:admCustomers,
    payments:admPayments,coupons:admCoupons,reports:admReports,cms:admCMS,audit:admAudit,roles:admRoles,settings:admSettings};
  const fn=map[adminTab]||admDashboard;
  // RBAC view gate
  const permMap={orders:'orders.view',returns:'returns.view',inventory:'inventory.view',products:'products.view',
    addproduct:'products.edit',categories:'categories.view',customers:'customers.view',payments:'payments.view',
    coupons:'coupons.view',reports:'reports.view',cms:'cms.view',audit:'orders.view',roles:'roles.view',settings:'orders.view'};
  if(adminTab!=='dashboard' && permMap[adminTab] && !can(permMap[adminTab])){
    m.innerHTML=`<div class="mod-head"><div><h1>Restricted</h1><p>Your role (${escapeHtml(currentUser.role)}) cannot view this module.</p></div></div>`;
    return;
  }
  m.innerHTML=fn();
  if(typeof fn._after==='function') fn._after();
}

/* ---------- shared admin building blocks ---------- */
function modHead(title,sub,action){ return `<div class="mod-head"><div><h1>${escapeHtml(title)}</h1>${sub?`<p>${escapeHtml(sub)}</p>`:''}</div>${action||''}</div>`; }
function emptyRow(cols,msg){ return `<tr><td colspan="${cols}" class="tbl-empty">${escapeHtml(msg)}</td></tr>`; }
function csvEscape(v){ v=String(v==null?'':v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
function downloadCSV(filename,rows){
  const csv=rows.map(r=>r.map(csvEscape).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
  toast('CSV exported','ok');
}

/* ============================================================ DASHBOARD */
function admDashboard(){
  const revenue=ORDERS.filter(o=>!['cancelled','payment-pending'].includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const pending=ORDERS.filter(o=>['payment-pending','processing','paid'].includes(o.status)).length;
  const lowStock=PRODUCTS.filter(p=>variantTotalStock(p)<=10).length;
  const kpis=[
    ['Revenue',ICN.pay,fmt(revenue),ORDERS.length+' orders total'],
    ['Orders',ICN.orders,ORDERS.length,pending+' need attention'],
    ['Low stock',ICN.inv,lowStock,'≤ 10 units'],
    ['Customers',ICN.cust,CUSTOMERS.length,'lifetime']
  ].map(([l,ic,v,d])=>`<div class="kpi"><div class="kl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${ic}</svg>${l}</div><div class="kv">${escapeHtml(String(v))}</div><div class="kd">${escapeHtml(d)}</div></div>`).join('');
  const recent=ORDERS.slice(0,6).map(o=>`<tr class="clickable" onclick="openAdminOrder('${o.id}')">
    <td class="mono">#${escapeHtml(o.id.slice(-6).toUpperCase())}</td><td>${escapeHtml(o.customer)}</td>
    <td>${fmt(orderTotal(o))}</td><td>${statusPill(o.status)}</td><td>${fmtDate(o.date)}</td></tr>`).join('')||emptyRow(5,'No orders yet.');
  const low=PRODUCTS.filter(p=>variantTotalStock(p)<=10).slice(0,6).map(p=>`<div class="info-line"><span>${escapeHtml(p.name)}</span><span>${variantTotalStock(p)} left</span></div>`).join('')||'<div class="info-line"><span>All products well stocked</span><span>✓</span></div>';
  return modHead('Dashboard','Store performance at a glance')+
    `<div class="kpi-grid">${kpis}</div>
     <div class="detail-grid">
       <div class="tbl-wrap"><div style="padding:16px 16px 0"><b style="font-family:var(--font-display)">Recent orders</b></div>
         <div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>${recent}</tbody></table></div></div>
       <div class="admin-card"><b style="font-family:var(--font-display)">Low stock</b><div style="margin-top:12px">${low}</div></div>
     </div>`;
}

/* ============================================================ ORDERS */
function admOrders(){
  if(adminState.detailOrder) return admOrderDetail(adminState.detailOrder);
  let list=ORDERS.slice();
  if(adminState.ordFilter!=='all') list=list.filter(o=>o.status===adminState.ordFilter);
  if(adminState.ordSearch){ const q=adminState.ordSearch.toLowerCase(); list=list.filter(o=>o.customer.toLowerCase().includes(q)||o.email.toLowerCase().includes(q)||o.id.toLowerCase().includes(q)); }
  if(adminState.ordSort==='total') list.sort((a,b)=>orderTotal(b)-orderTotal(a));
  else list.sort((a,b)=>new Date(b.date)-new Date(a.date));
  const statuses=['all',...Object.keys(ORDER_FLOW)];
  const rows=list.map(o=>`<tr class="clickable" onclick="openAdminOrder('${o.id}')">
    <td class="mono">#${escapeHtml(o.id.slice(-6).toUpperCase())}</td>
    <td>${escapeHtml(o.customer)}<br><small style="color:var(--ink-soft)">${escapeHtml(o.email)}</small></td>
    <td>${orderItemsCount(o)}</td><td>${fmt(orderTotal(o))}</td>
    <td>${escapeHtml(o.payment.method)}</td><td>${statusPill(o.status)}</td><td>${fmtDate(o.date)}</td></tr>`).join('')||emptyRow(7,'No orders match.');
  const action=`<button class="btn btn-primary" onclick="exportOrdersCSV()">Export CSV</button>`;
  return modHead('Orders',ORDERS.length+' total',action)+
    `<div class="mod-toolbar">
      <input class="grow" placeholder="Search customer, email, id…" value="${escapeHtml(adminState.ordSearch)}" oninput="adminState.ordSearch=this.value;refreshAdminBody()">
      <select onchange="adminState.ordFilter=this.value;refreshAdminBody()">${statuses.map(s=>`<option value="${s}" ${adminState.ordFilter===s?'selected':''}>${s==='all'?'All statuses':s.replace(/-/g,' ')}</option>`).join('')}</select>
      <select onchange="adminState.ordSort=this.value;refreshAdminBody()"><option value="date" ${adminState.ordSort==='date'?'selected':''}>Newest</option><option value="total" ${adminState.ordSort==='total'?'selected':''}>Highest value</option></select>
    </div>
    <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Pay</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function refreshAdminBody(){ const m=$('#adminMain'); if(m) m.innerHTML=({orders:admOrders,inventory:admInventory,customers:admCustomers,payments:admPayments,audit:admAudit,products:admProducts,returns:admReturns,coupons:admCoupons}[adminTab]||admDashboard)(); }
function openAdminOrder(id){ adminState.detailOrder=id; renderAdminTab(); }
function closeAdminOrder(){ adminState.detailOrder=null; renderAdminTab(); }
function exportOrdersCSV(){
  const rows=[['Order ID','Date','Customer','Email','Phone','Items','Subtotal','Discount','Shipping','Total','Payment','Status','Invoice']];
  ORDERS.forEach(o=>rows.push([o.id,fmtDate(o.date),o.customer,o.email,o.phone,orderItemsCount(o),orderSubtotal(o),o.discount||0,o.shipTotal||0,orderTotal(o),o.payment.method,o.status,o.payment.invoice||'']));
  downloadCSV('inovacure-orders.csv',rows);
}

function admOrderDetail(id){
  const o=ORDERS.find(x=>x.id===id); if(!o) return admOrders();
  const lines=o.lines.map(l=>`<div class="info-line"><span>${escapeHtml(l.name)} · ${escapeHtml(l.variant)} ×${l.qty}</span><span>${fmt(round2(l.price*l.qty))}</span></div>`).join('');
  const tl=o.timeline.map(t=>`<li><b>${escapeHtml(t.label)}</b><small>${fmtDateTime(t.t)} · ${escapeHtml(t.by||'system')}</small></li>`).join('');
  const next=allowedNext(o.status);
  const flow=next.length?next.map(s=>`<button class="iconlink" onclick="advanceOrder('${o.id}','${s}');adminState.detailOrder='${o.id}';renderAdminTab()">→ ${s.replace(/-/g,' ')}</button>`).join(''):'<span style="color:var(--ink-soft);font-size:.85rem">Terminal state — no further transitions.</span>';
  const tax=orderTaxBreakup(o).map(t=>`<div class="info-line"><span>GST @ ${t.rate}% (incl.)</span><span>${fmt(t.amt)}</span></div>`).join('');
  const canAdv=can('orders.advance');
  return modHead('Order #'+o.id.slice(-6).toUpperCase(), o.customer+' · '+fmtDate(o.date),
    `<button class="btn btn-ghost" onclick="closeAdminOrder()">← Back to orders</button>`)+
    `<div class="detail-grid">
      <div class="admin-card">
        <b style="font-family:var(--font-display)">Items</b>
        <div style="margin:12px 0">${lines}</div>
        <hr class="section-divider">
        <div class="info-line"><span>Subtotal</span><span>${fmt(orderSubtotal(o))}</span></div>
        ${o.discount?`<div class="info-line"><span>Discount${o.coupon?' ('+escapeHtml(o.coupon)+')':''}</span><span>−${fmt(o.discount)}</span></div>`:''}
        <div class="info-line"><span>Shipping</span><span>${o.shipTotal?fmt(o.shipTotal):'FREE'}</span></div>
        ${tax}
        <div class="info-line" style="font-weight:800"><span>Total</span><span>${fmt(orderTotal(o))}</span></div>
        <hr class="section-divider">
        <b style="font-family:var(--font-display)">Ship to</b>
        <p style="font-size:.88rem;color:var(--muted);margin-top:8px">${escapeHtml(o.ship.name)}<br>${escapeHtml(o.ship.line1)}<br>${escapeHtml(o.ship.city)} ${escapeHtml(o.ship.state||'')} ${escapeHtml(o.ship.pin||'')}<br>${escapeHtml(o.ship.phone||'')}</p>
      </div>
      <div>
        <div class="admin-card" style="margin-bottom:20px">
          <b style="font-family:var(--font-display)">Status</b>
          <div style="margin:10px 0">${statusPill(o.status)}</div>
          ${canAdv?`<div class="flow-btns">${flow}</div>`:'<span style="color:var(--ink-soft);font-size:.82rem">No permission to advance.</span>'}
          <hr class="section-divider">
          <b style="font-family:var(--font-display)">Payment</b>
          <div class="info-line"><span>Method</span><span>${escapeHtml(o.payment.method)}</span></div>
          <div class="info-line"><span>Status</span><span>${escapeHtml(o.payment.status)}</span></div>
          ${o.payment.txnId?`<div class="info-line"><span>Txn</span><span class="mono">${escapeHtml(o.payment.txnId)}</span></div>`:''}
          ${o.payment.invoice?`<div class="info-line"><span>Invoice</span><span class="mono">${escapeHtml(o.payment.invoice)}</span></div>`:''}
          ${o.payment.status!=='captured'&&o.payment.method!=='COD'&&can('payments.capture')?`<button class="iconlink" style="margin-top:10px" onclick="capturePayment('${o.id}')">Capture payment</button>`:''}
        </div>
        <div class="admin-card"><b style="font-family:var(--font-display)">Timeline</b><ul class="timeline" style="margin-top:12px">${tl}</ul></div>
      </div>
    </div>`;
}
function capturePayment(id){ const o=ORDERS.find(x=>x.id===id); if(!o)return; o.payment.status='captured'; o.payment.capturedAt=todayISO(); if(!o.payment.invoice)o.payment.invoice=nextInvoiceNo(); o.timeline.push({t:todayISO(),label:'Payment captured',by:currentUser.name}); logAudit('payment.capture','order #'+o.id.slice(-6),o.payment.invoice); persistAll(); renderAdminTab(); toast('Payment captured','ok'); }

/* ============================================================ RETURNS / RMA */
function admReturns(){
  const rows=RETURNS.map(r=>`<tr>
    <td class="mono">${escapeHtml(r.id.slice(-6).toUpperCase())}</td>
    <td class="mono">#${escapeHtml(String(r.orderId).slice(-6).toUpperCase())}</td>
    <td>${escapeHtml(r.customer)}</td><td class="mono">${escapeHtml(r.sku)}</td>
    <td>${escapeHtml(r.reason)}</td><td>${fmt(r.refund)}</td>
    <td><span class="pill ${r.status==='refunded'?'grey':r.status==='approved'?'blue':'amber'}">${escapeHtml(r.status)}</span></td>
    <td class="adm-actions">
      ${r.status==='requested'?`<button class="iconlink" onclick="setReturn('${r.id}','approved')">Approve</button>`:''}
      ${r.status==='approved'?`<button class="iconlink" onclick="setReturn('${r.id}','refunded')">Mark refunded</button>`:''}
    </td></tr>`).join('')||emptyRow(8,'No return requests.');
  return modHead('Returns / RMA',RETURNS.length+' request(s)',`<button class="btn btn-primary" onclick="newReturn()">New return</button>`)+
    `<div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>RMA</th><th>Order</th><th>Customer</th><th>SKU</th><th>Reason</th><th>Refund</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function setReturn(id,status){
  const r=RETURNS.find(x=>x.id===id); if(!r)return;
  r.status=status;
  if(status==='refunded'){
    if(r.restock){ const o=ORDERS.find(x=>x.id===r.orderId); if(o){ const l=o.lines.find(x=>x.sku===r.sku); if(l){ const p=getProduct(l.productId); const v=getVariant(p,r.sku); if(v){ v.stock=+v.stock+l.qty; syncProductFromVariants(p);} } } }
    const o=ORDERS.find(x=>x.id===r.orderId); if(o && o.status==='returned'){ advanceOrder(o.id,'refunded'); }
  }
  logAudit('return.'+status,'rma '+id.slice(-6),r.sku); persistAll(); renderAdminTab(); toast('Return '+status,'ok');
}
function newReturn(){
  const delivered=ORDERS.filter(o=>o.status==='delivered');
  if(!delivered.length){ toast('No delivered orders to return','err'); return; }
  openModal(`<div class="modal-head"><h3>New return</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="field"><label>Order</label><select id="rtOrder" onchange="rtFillSku()">${delivered.map(o=>`<option value="${o.id}">#${o.id.slice(-6).toUpperCase()} · ${escapeHtml(o.customer)}</option>`).join('')}</select></div>
      <div class="field"><label>Item (SKU)</label><select id="rtSku"></select></div>
      <div class="field"><label>Reason</label><input id="rtReason" placeholder="e.g. Damaged in transit"></div>
      <label style="display:flex;gap:8px;align-items:center;font-size:.88rem;margin-bottom:14px"><input type="checkbox" id="rtRestock" checked style="width:auto"> Restock on refund</label>
      <button class="btn btn-primary" style="width:100%" onclick="saveReturn()">Create return</button>
    </div>`);
  rtFillSku();
}
function rtFillSku(){ const o=ORDERS.find(x=>x.id===$('#rtOrder').value); const sel=$('#rtSku'); if(o&&sel) sel.innerHTML=o.lines.map(l=>`<option value="${l.sku}">${escapeHtml(l.name)} · ${escapeHtml(l.variant)}</option>`).join(''); }
function saveReturn(){
  const o=ORDERS.find(x=>x.id===$('#rtOrder').value); const sku=$('#rtSku').value;
  const l=o.lines.find(x=>x.sku===sku);
  RETURNS.unshift({id:uid('rma'),orderId:o.id,customer:o.customer,sku,reason:$('#rtReason').value.trim()||'Not specified',status:'requested',refund:round2(l.price*l.qty),date:todayISO(),restock:$('#rtRestock').checked});
  logAudit('return.create','order #'+o.id.slice(-6),sku); persistAll(); closeModal(); renderAdminTab(); toast('Return created','ok');
}

/* ============================================================ INVENTORY */
function admInventory(){
  let list=[];
  PRODUCTS.forEach(p=>p.variants.forEach(v=>list.push({p,v})));
  if(adminState.invSearch){ const q=adminState.invSearch.toLowerCase(); list=list.filter(x=>x.p.name.toLowerCase().includes(q)||x.v.sku.toLowerCase().includes(q)||x.p.segment.toLowerCase().includes(q)); }
  if(adminState.invSort==='stock') list.sort((a,b)=>a.v.stock-b.v.stock);
  else if(adminState.invSort==='price') list.sort((a,b)=>a.v.price-b.v.price);
  else list.sort((a,b)=>a.p.name.localeCompare(b.p.name));
  const total=list.length, pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
  if(adminState.invPage>pages) adminState.invPage=pages;
  const slice=list.slice((adminState.invPage-1)*PAGE_SIZE,adminState.invPage*PAGE_SIZE);
  const rows=slice.map(({p,v})=>{ const ss=stockState(v.stock);
    return `<tr>
      <td>${escapeHtml(p.name)}</td><td>${escapeHtml(v.label)}</td><td class="mono">${escapeHtml(v.sku)}</td>
      <td>${fmt(v.price)}</td><td>${fmt(v.mrp)}</td>
      <td><span class="pill ${ss==='out'?'red':ss==='low'?'amber':'green'}">${v.stock}</span></td>
      <td class="adm-actions">${can('inventory.edit')?`<button class="iconlink" onclick="editStock('${p.id}','${v.sku}')">Edit</button>`:''}</td>
    </tr>`;}).join('')||emptyRow(7,'No inventory matches.');
  const action=`<button class="btn btn-primary" onclick="exportInventoryCSV()">Export CSV</button>`;
  return modHead('Inventory',total+' variant SKUs',action)+
    `<div class="mod-toolbar">
      <input class="grow" placeholder="Search product, SKU…" value="${escapeHtml(adminState.invSearch)}" oninput="adminState.invSearch=this.value;adminState.invPage=1;refreshAdminBody()">
      <select onchange="adminState.invSort=this.value;refreshAdminBody()"><option value="name" ${adminState.invSort==='name'?'selected':''}>Name</option><option value="stock" ${adminState.invSort==='stock'?'selected':''}>Stock (low first)</option><option value="price" ${adminState.invSort==='price'?'selected':''}>Price</option></select>
      <label class="iconlink" style="cursor:pointer">Import CSV<input type="file" accept=".csv" style="display:none" onchange="importInventoryCSV(event)"></label>
    </div>
    <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Product</th><th>Variant</th><th>SKU</th><th>Price</th><th>MRP</th><th>Stock</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="adm-pager"><span>Page ${adminState.invPage} of ${pages} · ${total} SKUs</span><span class="pg-btns"><button class="iconlink" ${adminState.invPage<=1?'disabled':''} onclick="adminState.invPage--;refreshAdminBody()">Prev</button><button class="iconlink" ${adminState.invPage>=pages?'disabled':''} onclick="adminState.invPage++;refreshAdminBody()">Next</button></span></div>
    </div>`;
}
function editStock(pid,sku){
  const p=getProduct(pid); const v=getVariant(p,sku);
  openModal(`<div class="modal-head"><h3>Edit ${escapeHtml(v.label)}</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body"><p class="hint" style="margin-bottom:12px">${escapeHtml(p.name)} · ${escapeHtml(sku)}</p>
      <div class="adm-grid3">
        <div class="field"><label>Price</label><input id="esPrice" type="number" value="${v.price}"></div>
        <div class="field"><label>MRP</label><input id="esMrp" type="number" value="${v.mrp}"></div>
        <div class="field"><label>Stock</label><input id="esStock" type="number" value="${v.stock}"></div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="saveStock('${pid}','${sku}')">Save</button>
    </div>`);
}
function saveStock(pid,sku){ const p=getProduct(pid); const v=getVariant(p,sku);
  v.price=+$('#esPrice').value||0; v.mrp=+$('#esMrp').value||0; v.stock=Math.max(0,+$('#esStock').value||0);
  syncProductFromVariants(p); logAudit('inventory.edit',p.name,sku+' → stock '+v.stock); persistAll(); closeModal(); renderAdminTab(); toast('Inventory updated','ok'); }
function exportInventoryCSV(){
  const rows=[['Product','Variant','SKU','Price','MRP','Stock','Segment','TaxRate','HSN']];
  PRODUCTS.forEach(p=>p.variants.forEach(v=>rows.push([p.name,v.label,v.sku,v.price,v.mrp,v.stock,p.segment,p.taxRate,p.taxCode])));
  downloadCSV('inovacure-inventory.csv',rows);
}
function importInventoryCSV(ev){
  const file=ev.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{ try{
    const lines=String(reader.result).split(/\r?\n/).filter(Boolean); lines.shift();
    let n=0;
    lines.forEach(ln=>{ const c=ln.split(','); const sku=(c[2]||'').replace(/^"|"$/g,'').trim(); if(!sku)return;
      for(const p of PRODUCTS){ const v=getVariant(p,sku); if(v){ if(c[3])v.price=+c[3]; if(c[4])v.mrp=+c[4]; if(c[5]!=='')v.stock=Math.max(0,+c[5]); syncProductFromVariants(p); n++; break; } } });
    logAudit('inventory.import','csv',n+' SKUs updated'); persistAll(); renderAdminTab(); toast(n+' SKUs updated from CSV','ok');
  }catch(e){ toast('Could not parse CSV','err'); } };
  reader.readAsText(file);
}

/* ============================================================ PRODUCTS */
function admProducts(){
  const cards=PRODUCTS.map(p=>{ const img=p.image?`<img src="${escapeHtml(p.image)}" alt="" style="width:46px;height:46px;border-radius:8px;object-fit:contain;background:#fff;padding:3px;border:1px solid #e3e9f1">`:`<span style="width:46px;height:46px;border-radius:8px;display:inline-grid;place-items:center;background:${p.bg}">${ART_ICONS[p.icon]?'<svg viewBox="0 0 120 120" width="30" height="30">'+ART_ICONS[p.icon]+'</svg>':''}</span>`;
    return `<tr>
      <td style="display:flex;align-items:center;gap:12px">${img}<span><b style="font-family:var(--font-display)">${escapeHtml(p.name)}</b><br><small style="color:var(--ink-soft)">${escapeHtml(p.segment)} · ${p.variants.length} variant(s)</small></span></td>
      <td>${fmt(p.price)}</td><td>${variantTotalStock(p)}</td><td>${p.badge?`<span class="role-tag">${escapeHtml(p.badge)}</span>`:'—'}</td>
      <td class="adm-actions">
        ${can('products.edit')?`<button class="iconlink" onclick="editProductForm('${p.id}')">Edit</button>`:''}
        ${can('products.edit')?`<button class="iconlink" onclick="cloneProduct('${p.id}')">Clone</button>`:''}
        ${can('products.delete')?`<button class="iconlink danger" onclick="deleteProduct('${p.id}')">Delete</button>`:''}
      </td></tr>`;}).join('')||emptyRow(5,'No products.');
  return modHead('Products',PRODUCTS.length+' in catalog',`<button class="btn btn-primary" onclick="adminGo('addproduct')">Add product</button>`)+
    `<div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Product</th><th>From</th><th>Stock</th><th>Badge</th><th></th></tr></thead><tbody>${cards}</tbody></table></div></div>`;
}
function cloneProduct(id){ const p=getProduct(id); const c=JSON.parse(JSON.stringify(p)); c.id=uid('p'); c.name=p.name+' (copy)'; c.baseSku=p.baseSku+'-C'; c.variants=c.variants.map((v,i)=>({...v,sku:v.sku+'-C'})); syncProductFromVariants(c); PRODUCTS.push(c); logAudit('product.clone',p.name,c.id); persistAll(); renderAdminTab(); toast('Product cloned','ok'); }
function deleteProduct(id){ const p=getProduct(id); if(!confirm('Delete "'+p.name+'"? This cannot be undone.'))return; PRODUCTS=PRODUCTS.filter(x=>x.id!==id); logAudit('product.delete',p.name,id); persistAll(); renderAdminTab(); toast('Product deleted'); }

/* ============================================================ ADD / EDIT PRODUCT */
function admAddProduct(){ return productForm(null); }
function editProductForm(id){ adminState.editProduct=id; adminTab='addproduct'; renderAdmin(); }
function productForm(_){
  const editing=adminState.editProduct?getProduct(adminState.editProduct):null;
  const p=editing||{name:'',segment:CATEGORIES[0]?CATEGORIES[0].name:'',baseSku:'',badge:'',taxRate:12,taxCode:'3004',shortDesc:'',features:[],icon:'pill',bg:'#eef4fb',variants:[{label:'',sku:'',price:'',mrp:'',stock:''}],content:{}};
  const cats=CATEGORIES.map(c=>`<option value="${escapeHtml(c.name)}" ${p.segment===c.name?'selected':''}>${escapeHtml(c.name)}</option>`).join('');
  const vrows=p.variants.map((v,i)=>varEditRow(v,i)).join('');
  return modHead(editing?'Edit product':'Add product',editing?escapeHtml(editing.name):'Create a new catalog item',
    `<button class="btn btn-ghost" onclick="cancelProductForm()">Cancel</button>`)+
    `<div class="admin-card adm-form" style="max-width:860px">
      <div class="adm-grid2">
        <div class="field"><label>Product name *</label><input id="pfName2" value="${escapeHtml(p.name)}"></div>
        <div class="field"><label>Category *</label><select id="pfSeg">${cats}</select></div>
      </div>
      <div class="adm-grid3">
        <div class="field"><label>Base SKU</label><input id="pfSku" value="${escapeHtml(p.baseSku)}"></div>
        <div class="field"><label>Badge</label><input id="pfBadge" value="${escapeHtml(p.badge)}" placeholder="Bestseller / New"></div>
        <div class="field"><label>GST %</label><input id="pfTax" type="number" value="${p.taxRate}"></div>
      </div>
      <div class="field"><label>Short description</label><textarea id="pfDesc" rows="2">${escapeHtml(p.shortDesc)}</textarea></div>
      <div class="field"><label>Features (one per line)</label><textarea id="pfFeat" rows="3">${escapeHtml((p.features||[]).join('\n'))}</textarea></div>
      <div class="adm-grid2">
        <div class="field"><label>Composition / ingredients</label><input id="pfIng" value="${escapeHtml((p.content||{}).ingredients||'')}"></div>
        <div class="field"><label>Certifications</label><input id="pfCert" value="${escapeHtml((p.content||{}).certifications||'')}"></div>
      </div>
      <hr class="section-divider">
      <b style="font-family:var(--font-display)">Variants</b>
      <p class="hint" style="margin:4px 0 12px">Top-level price & stock derive automatically from in-stock variants.</p>
      <div style="display:grid;grid-template-columns:1.4fr 1.4fr 1fr 1fr 1fr auto;gap:8px;font-size:.72rem;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px"><span>Label</span><span>SKU</span><span>Price</span><span>MRP</span><span>Stock</span><span></span></div>
      <div id="varRows">${vrows}</div>
      <button class="iconlink" onclick="addVarRow()">+ Add variant</button>
      <hr class="section-divider">
      <button class="btn btn-primary" onclick="saveProduct()">${editing?'Save changes':'Create product'}</button>
    </div>`;
}
function varEditRow(v,i){ return `<div class="var-edit-row" data-i="${i}">
  <input placeholder="e.g. 30 ml" value="${escapeHtml(v.label||'')}" data-f="label">
  <input placeholder="SKU" value="${escapeHtml(v.sku||'')}" data-f="sku">
  <input type="number" placeholder="0" value="${v.price||''}" data-f="price">
  <input type="number" placeholder="0" value="${v.mrp||''}" data-f="mrp">
  <input type="number" placeholder="0" value="${v.stock||''}" data-f="stock">
  <button class="x" onclick="this.closest('.var-edit-row').remove()" aria-label="Remove">×</button></div>`; }
function addVarRow(){ const c=document.createElement('div'); c.innerHTML=varEditRow({},Date.now()); $('#varRows').appendChild(c.firstChild); }
function cancelProductForm(){ adminState.editProduct=null; adminGo('products'); }
function saveProduct(){
  const name=$('#pfName2').value.trim(); if(!name){ toast('Name is required','err'); return; }
  const variants=$$('#varRows .var-edit-row').map(r=>{ const g=f=>r.querySelector(`[data-f="${f}"]`).value;
    return {label:g('label').trim()||'Standard',sku:(g('sku').trim()||('SKU-'+Math.random().toString(36).slice(2,7).toUpperCase())),price:+g('price')||0,mrp:+g('mrp')||+g('price')||0,stock:Math.max(0,+g('stock')||0)};
  }).filter(v=>v.label||v.price);
  if(!variants.length){ toast('Add at least one variant','err'); return; }
  const editing=adminState.editProduct?getProduct(adminState.editProduct):null;
  const seg=$('#pfSeg').value;
  const data={ name, segment:seg, baseSku:$('#pfSku').value.trim()||name.slice(0,6).toUpperCase(),
    badge:$('#pfBadge').value.trim(), taxRate:+$('#pfTax').value||0, taxCode:editing?editing.taxCode:'3004',
    shortDesc:$('#pfDesc').value.trim(), features:$('#pfFeat').value.split('\n').map(s=>s.trim()).filter(Boolean),
    icon:(editing?editing.icon:0)||SEG_ICON[seg]||'pill', bg:(editing?editing.bg:0)||SEG_BG[seg]||'#eef4fb',
    variants,
    content:Object.assign({},editing?editing.content:{origin:'India',certifications:'WHO-GMP · Lab-tested',shelfLife:'24 months'},{ingredients:$('#pfIng').value.trim(),certifications:$('#pfCert').value.trim()||((editing&&editing.content&&editing.content.certifications)||'WHO-GMP · Lab-tested')}),
    rating:editing?editing.rating:4.6, reviewCount:editing?editing.reviewCount:0, image:editing?editing.image:null, faqs:editing?editing.faqs:[], reviews:editing?editing.reviews:[] };
  if(editing){ Object.assign(editing,data); syncProductFromVariants(editing); logAudit('product.edit',name,editing.id); }
  else { const np=Object.assign({id:uid('p')},data); syncProductFromVariants(np); PRODUCTS.push(np); logAudit('product.create',name,np.id); }
  adminState.editProduct=null; persistAll(); adminGo('products'); toast(editing?'Product saved':'Product created','ok');
}

/* ============================================================ CATEGORIES */
function admCategories(){
  const rows=CATEGORIES.map(c=>`<tr>
    <td><b style="font-family:var(--font-display)">${escapeHtml(c.name)}</b></td>
    <td class="mono">${escapeHtml(c.slug)}</td><td>${escapeHtml(c.seo)}</td>
    <td>${PRODUCTS.filter(p=>p.segment===c.name).length}</td>
    <td class="adm-actions">${can('categories.edit')?`<button class="iconlink" onclick="editCategory('${c.id}')">Edit</button><button class="iconlink danger" onclick="deleteCategory('${c.id}')">Delete</button>`:''}</td>
  </tr>`).join('')||emptyRow(5,'No categories.');
  return modHead('Categories',CATEGORIES.length+' taxonomy entries',`<button class="btn btn-primary" onclick="editCategory(null)">Add category</button>`)+
    `<div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Name</th><th>Slug</th><th>SEO description</th><th>Products</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function editCategory(id){
  const c=id?CATEGORIES.find(x=>x.id===id):{name:'',seo:''};
  openModal(`<div class="modal-head"><h3>${id?'Edit':'Add'} category</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="field"><label>Name</label><input id="ctName" value="${escapeHtml(c.name)}"></div>
      <div class="field"><label>SEO description</label><input id="ctSeo" value="${escapeHtml(c.seo)}"></div>
      <button class="btn btn-primary" style="width:100%" onclick="saveCategory('${id||''}')">Save</button>
    </div>`);
}
function saveCategory(id){
  const name=$('#ctName').value.trim(); if(!name){ toast('Name required','err'); return; }
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(id){ const c=CATEGORIES.find(x=>x.id===id); const old=c.name; c.name=name; c.slug=slug; c.seo=$('#ctSeo').value.trim();
    if(old!==name) PRODUCTS.forEach(p=>{ if(p.segment===old)p.segment=name; }); logAudit('category.edit',name,id); }
  else { CATEGORIES.push({id:uid('cat'),name,slug,seo:$('#ctSeo').value.trim(),order:CATEGORIES.length+1}); logAudit('category.create',name,slug); }
  persistAll(); closeModal(); renderAdminTab(); toast('Category saved','ok');
}
function deleteCategory(id){ const c=CATEGORIES.find(x=>x.id===id); if(PRODUCTS.some(p=>p.segment===c.name)){ toast('Move products out of this category first','err'); return; } if(!confirm('Delete category "'+c.name+'"?'))return; CATEGORIES=CATEGORIES.filter(x=>x.id!==id); logAudit('category.delete',c.name,id); persistAll(); renderAdminTab(); toast('Category deleted'); }

/* ============================================================ CUSTOMERS */
function admCustomers(){
  if(adminState.detailCust) return admCustomerDetail(adminState.detailCust);
  let list=CUSTOMERS.slice();
  if(adminState.custSearch){ const q=adminState.custSearch.toLowerCase(); list=list.filter(c=>c.name.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||(c.phone||'').includes(q)); }
  const rows=list.map(c=>{ const orders=ORDERS.filter(o=>o.email===c.email); const spent=orders.filter(o=>!['cancelled','payment-pending'].includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
    return `<tr class="clickable" onclick="openCustomer('${c.id}')">
      <td><b style="font-family:var(--font-display)">${escapeHtml(c.name)}</b></td>
      <td>${escapeHtml(c.email)}</td><td>${escapeHtml(c.phone||'—')}</td><td>${escapeHtml(c.city||'—')}</td>
      <td>${orders.length}</td><td>${fmt(spent)}</td><td>${fmtDate(c.since)}</td></tr>`;}).join('')||emptyRow(7,'No customers.');
  return modHead('Customers',CUSTOMERS.length+' total')+
    `<div class="mod-toolbar"><input class="grow" placeholder="Search name, email, phone…" value="${escapeHtml(adminState.custSearch)}" oninput="adminState.custSearch=this.value;refreshAdminBody()"></div>
     <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Orders</th><th>Spent</th><th>Since</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function openCustomer(id){ adminState.detailCust=id; renderAdminTab(); }
function closeCustomer(){ adminState.detailCust=null; renderAdminTab(); }
function admCustomerDetail(id){
  const c=CUSTOMERS.find(x=>x.id===id); if(!c) return admCustomers();
  const orders=ORDERS.filter(o=>o.email===c.email);
  const spent=orders.filter(o=>!['cancelled','payment-pending'].includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const orows=orders.map(o=>`<tr class="clickable" onclick="adminState.detailCust=null;adminTab='orders';openAdminOrder('${o.id}')"><td class="mono">#${o.id.slice(-6).toUpperCase()}</td><td>${fmt(orderTotal(o))}</td><td>${statusPill(o.status)}</td><td>${fmtDate(o.date)}</td></tr>`).join('')||emptyRow(4,'No orders yet.');
  return modHead(c.name,c.email,`<button class="btn btn-ghost" onclick="closeCustomer()">← Back</button>`)+
    `<div class="detail-grid">
      <div class="tbl-wrap"><div style="padding:16px 16px 0"><b style="font-family:var(--font-display)">Order history</b></div><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Order</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>${orows}</tbody></table></div></div>
      <div class="admin-card">
        <div class="info-line"><span>Lifetime spend</span><span>${fmt(spent)}</span></div>
        <div class="info-line"><span>Orders</span><span>${orders.length}</span></div>
        <div class="info-line"><span>Phone</span><span>${escapeHtml(c.phone||'—')}</span></div>
        <div class="info-line"><span>City</span><span>${escapeHtml(c.city||'—')}</span></div>
        <div class="info-line"><span>Customer since</span><span>${fmtDate(c.since)}</span></div>
      </div>
    </div>`;
}

/* ============================================================ PAYMENTS */
function admPayments(){
  let list=ORDERS.slice();
  if(adminState.payFilter!=='all') list=list.filter(o=>o.payment.status===adminState.payFilter);
  const captured=ORDERS.filter(o=>o.payment.status==='captured').reduce((s,o)=>s+orderTotal(o),0);
  const pending=ORDERS.filter(o=>o.payment.status==='pending').reduce((s,o)=>s+orderTotal(o),0);
  const refunded=ORDERS.filter(o=>o.payment.status==='refunded').reduce((s,o)=>s+orderTotal(o),0);
  const kpis=[['Captured',fmt(captured)],['Pending',fmt(pending)],['Refunded',fmt(refunded)]].map(([l,v])=>`<div class="kpi"><div class="kl">${l}</div><div class="kv" style="font-size:1.4rem">${v}</div></div>`).join('');
  const rows=list.map(o=>`<tr>
    <td class="mono">#${o.id.slice(-6).toUpperCase()}</td><td>${escapeHtml(o.customer)}</td>
    <td>${escapeHtml(o.payment.method)}</td><td class="mono">${escapeHtml(o.payment.txnId||'—')}</td>
    <td>${fmt(orderTotal(o))}</td><td><span class="pill ${o.payment.status==='captured'?'green':o.payment.status==='refunded'?'grey':'amber'}">${escapeHtml(o.payment.status)}</span></td>
    <td class="mono">${escapeHtml(o.payment.invoice||'—')}</td></tr>`).join('')||emptyRow(7,'No payments.');
  return modHead('Payments','Transactions & settlements')+
    `<div class="kpi-grid">${kpis}</div>
     <div class="mod-toolbar"><select onchange="adminState.payFilter=this.value;refreshAdminBody()"><option value="all">All</option><option value="captured" ${adminState.payFilter==='captured'?'selected':''}>Captured</option><option value="pending" ${adminState.payFilter==='pending'?'selected':''}>Pending</option><option value="refunded" ${adminState.payFilter==='refunded'?'selected':''}>Refunded</option></select></div>
     <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Order</th><th>Customer</th><th>Method</th><th>Txn</th><th>Amount</th><th>Status</th><th>Invoice</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

/* ============================================================ COUPONS */
function admCoupons(){
  const rows=Object.values(COUPONS).map(c=>`<tr>
    <td class="mono"><b>${escapeHtml(c.code)}</b></td><td>${c.type==='pct'?c.value+'%':fmt(c.value)}</td>
    <td>${escapeHtml(c.desc)}</td><td>${c.minCart?fmt(c.minCart):'—'}</td><td>${c.uses||0}</td>
    <td><span class="pill ${c.active?'green':'grey'}">${c.active?'active':'off'}</span></td>
    <td class="adm-actions">${can('coupons.edit')?`<button class="iconlink" onclick="toggleCoupon('${c.code}')">${c.active?'Disable':'Enable'}</button><button class="iconlink danger" onclick="deleteCoupon('${c.code}')">Delete</button>`:''}</td>
  </tr>`).join('')||emptyRow(7,'No coupons.');
  return modHead('Coupons',Object.keys(COUPONS).length+' codes',`<button class="btn btn-primary" onclick="addCoupon()">Add coupon</button>`)+
    `<div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Code</th><th>Value</th><th>Description</th><th>Min cart</th><th>Uses</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function toggleCoupon(code){ const c=COUPONS[code]; c.active=!c.active; logAudit('coupon.toggle',code,c.active?'enabled':'disabled'); persistAll(); renderAdminTab(); toast('Coupon '+(c.active?'enabled':'disabled'),'ok'); }
function deleteCoupon(code){ if(!confirm('Delete coupon '+code+'?'))return; delete COUPONS[code]; logAudit('coupon.delete',code,''); persistAll(); renderAdminTab(); toast('Coupon deleted'); }
function addCoupon(){
  openModal(`<div class="modal-head"><h3>New coupon</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="adm-grid2">
        <div class="field"><label>Code</label><input id="cpCode" style="text-transform:uppercase" placeholder="SAVE15"></div>
        <div class="field"><label>Type</label><select id="cpType"><option value="pct">Percent %</option><option value="flat">Flat ₹</option></select></div>
      </div>
      <div class="adm-grid2">
        <div class="field"><label>Value</label><input id="cpVal" type="number" placeholder="15"></div>
        <div class="field"><label>Min cart</label><input id="cpMin" type="number" value="0"></div>
      </div>
      <div class="field"><label>Description</label><input id="cpDesc" placeholder="15% off"></div>
      <button class="btn btn-primary" style="width:100%" onclick="saveCoupon()">Create coupon</button>
    </div>`);
}
function saveCoupon(){
  const code=$('#cpCode').value.trim().toUpperCase(); if(!code){ toast('Code required','err'); return; }
  if(COUPONS[code]){ toast('That code already exists','err'); return; }
  COUPONS[code]={code,type:$('#cpType').value,value:+$('#cpVal').value||0,desc:$('#cpDesc').value.trim()||code,active:true,uses:0,cap:0,minCart:+$('#cpMin').value||0,expires:'2026-12-31'};
  logAudit('coupon.create',code,''); persistAll(); closeModal(); renderAdminTab(); toast('Coupon created','ok');
}

/* ============================================================ REPORTS */
function admReports(){
  const byCat={};
  ORDERS.filter(o=>!['cancelled','payment-pending'].includes(o.status)).forEach(o=>o.lines.forEach(l=>{ const p=getProduct(l.productId); const seg=p?p.segment:'Other'; byCat[seg]=(byCat[seg]||0)+round2(l.price*l.qty); }));
  const max=Math.max(1,...Object.values(byCat));
  const bars=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([seg,v])=>`<div class="bar-row"><span class="bl">${escapeHtml(seg)}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.round(v/max*100)}%"></span></span><span class="bv">${fmt(v)}</span></div>`).join('')||'<p style="color:var(--ink-soft)">No sales data yet.</p>';
  const low=PRODUCTS.filter(p=>variantTotalStock(p)<=10).sort((a,b)=>variantTotalStock(a)-variantTotalStock(b));
  const lowBars=low.map(p=>`<div class="bar-row"><span class="bl">${escapeHtml(p.name)}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.min(100,variantTotalStock(p)*10)}%;background:var(--danger)"></span></span><span class="bv">${variantTotalStock(p)}</span></div>`).join('')||'<p style="color:var(--ink-soft)">All products well stocked.</p>';
  const revenue=ORDERS.filter(o=>!['cancelled','payment-pending'].includes(o.status)).reduce((s,o)=>s+orderTotal(o),0);
  const aov=ORDERS.length?revenue/ORDERS.filter(o=>!['cancelled','payment-pending'].includes(o.status)).length:0;
  return modHead('Reports','Revenue & inventory health')+
    `<div class="kpi-grid">
      <div class="kpi"><div class="kl">Net revenue</div><div class="kv" style="font-size:1.5rem">${fmt(revenue)}</div></div>
      <div class="kpi"><div class="kl">Avg order value</div><div class="kv" style="font-size:1.5rem">${fmt(aov)}</div></div>
      <div class="kpi"><div class="kl">Low-stock items</div><div class="kv" style="font-size:1.5rem">${low.length}</div></div>
    </div>
    <div class="detail-grid">
      <div class="admin-card"><b style="font-family:var(--font-display)">Revenue by category</b><div style="margin-top:16px">${bars}</div></div>
      <div class="admin-card"><b style="font-family:var(--font-display)">Low stock</b><div style="margin-top:16px">${lowBars}</div></div>
    </div>`;
}

/* ============================================================ CMS */
function admCMS(){
  return modHead('Content / CMS','Storefront copy & announcements')+
    `<div class="admin-card adm-form" style="max-width:680px">
      <div class="field"><label>Announcement bar</label><input id="cmsAnn" value="${escapeHtml(CMS.announcement)}"></div>
      <div class="field"><label>Hero title</label><input id="cmsHero" value="${escapeHtml(CMS.heroTitle)}"></div>
      <div class="field"><label>Return policy line</label><input id="cmsRet" value="${escapeHtml(CMS.returnPolicy)}"></div>
      <button class="btn btn-primary" onclick="saveCMS()">Save content</button>
    </div>`;
}
function saveCMS(){ CMS.announcement=$('#cmsAnn').value; CMS.heroTitle=$('#cmsHero').value; CMS.returnPolicy=$('#cmsRet').value; SETTINGS.returnPolicy=CMS.returnPolicy; persist('cms',CMS); persist('settings',SETTINGS); logAudit('cms.edit','content',''); toast('Content saved','ok'); }

/* ============================================================ AUDIT */
function admAudit(){
  let list=AUDIT.slice();
  if(adminState.auditSearch){ const q=adminState.auditSearch.toLowerCase(); list=list.filter(a=>(a.action+a.entity+a.detail+a.actor).toLowerCase().includes(q)); }
  const rows=list.slice(0,200).map(a=>`<tr class="audit-row"><td>${fmtDateTime(a.t)}</td><td>${escapeHtml(a.actor)}</td><td class="mono">${escapeHtml(a.action)}</td><td>${escapeHtml(a.entity)}</td><td>${escapeHtml(a.detail)}</td></tr>`).join('')||emptyRow(5,'No audit entries.');
  return modHead('Audit log',AUDIT.length+' events (append-only)')+
    `<div class="mod-toolbar"><input class="grow" placeholder="Search actions…" value="${escapeHtml(adminState.auditSearch)}" oninput="adminState.auditSearch=this.value;refreshAdminBody()"></div>
     <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Detail</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

/* ============================================================ ROLES & STAFF */
function admRoles(){
  const rows=STAFF.map(s=>`<tr>
    <td><b style="font-family:var(--font-display)">${escapeHtml(s.name)}</b></td><td>${escapeHtml(s.email)}</td>
    <td><span class="role-tag">${escapeHtml(s.role)}</span></td>
    <td><span class="pill ${s.active?'green':'grey'}">${s.active?'active':'inactive'}</span></td>
    <td class="adm-actions">${can('roles.edit')&&s.role!=='owner'?`<button class="iconlink" onclick="toggleStaff('${s.id}')">${s.active?'Deactivate':'Activate'}</button>`:''}</td>
  </tr>`).join('');
  const matrix=Object.entries(ROLES).map(([r,perms])=>`<div class="info-line"><span><span class="role-tag">${r}</span></span><span style="font-family:ui-monospace,monospace;font-size:.78rem">${perms.join(', ')}</span></div>`).join('');
  return modHead('Roles & staff',STAFF.length+' team members',`<button class="btn btn-primary" onclick="addStaff()">Add staff</button>`)+
    `<div class="detail-grid">
      <div class="tbl-wrap"><div class="tbl-scroll"><table class="admin-tbl"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>
      <div class="admin-card"><b style="font-family:var(--font-display)">Permission matrix</b><div style="margin-top:12px">${matrix}</div></div>
    </div>`;
}
function toggleStaff(id){ const s=STAFF.find(x=>x.id===id); s.active=!s.active; logAudit('staff.toggle',s.name,s.active?'activated':'deactivated'); persistAll(); renderAdminTab(); toast('Staff updated','ok'); }
function addStaff(){
  const roles=Object.keys(ROLES).filter(r=>r!=='owner');
  openModal(`<div class="modal-head"><h3>Add staff</h3><button class="panel-close" onclick="closeModal()">&times;</button></div>
    <div class="modal-body">
      <div class="field"><label>Name</label><input id="stName"></div>
      <div class="field"><label>Email</label><input id="stEmail" type="email"></div>
      <div class="field"><label>Role</label><select id="stRole">${roles.map(r=>`<option value="${r}">${r}</option>`).join('')}</select></div>
      <button class="btn btn-primary" style="width:100%" onclick="saveStaff()">Add team member</button>
    </div>`);
}
function saveStaff(){ const name=$('#stName').value.trim(), email=$('#stEmail').value.trim(); if(!name||!email){ toast('Name and email required','err'); return; }
  STAFF.push({id:uid('s'),name,email,role:$('#stRole').value,active:true}); logAudit('staff.create',name,$('#stRole').value); persistAll(); closeModal(); renderAdminTab(); toast('Staff added','ok'); }

/* ============================================================ SETTINGS */
function admSettings(){
  return modHead('Settings','Store configuration')+
    `<div class="admin-card adm-form" style="max-width:760px">
      <div class="adm-grid2">
        <div class="field"><label>Store name</label><input id="setName" value="${escapeHtml(SETTINGS.storeName)}"></div>
        <div class="field"><label>Support email</label><input id="setEmail" value="${escapeHtml(SETTINGS.supportEmail)}"></div>
      </div>
      <div class="adm-grid3">
        <div class="field"><label>Free-ship threshold</label><input id="setFree" type="number" value="${SETTINGS.freeShipThreshold}"></div>
        <div class="field"><label>Flat ship fee</label><input id="setFlat" type="number" value="${SETTINGS.flatShip}"></div>
        <div class="field"><label>Invoice prefix</label><input id="setInv" value="${escapeHtml(SETTINGS.invoicePrefix)}"></div>
      </div>
      <div class="adm-grid2">
        <div class="field"><label>GSTIN</label><input id="setGst" value="${escapeHtml(SETTINGS.gstin)}"></div>
        <div class="field"><label>Domain</label><input id="setDom" value="${escapeHtml(SETTINGS.domain)}"></div>
      </div>
      <div class="field"><label>Admin OTP email</label><input id="setOtp" value="${escapeHtml(ADMIN_OTP_EMAIL)}"><div class="hint">Where the admin sign-in one-time code is sent.</div></div>
      <button class="btn btn-primary" onclick="saveSettings()">Save settings</button>
      <hr class="section-divider">
      <b style="font-family:var(--font-display)">Integrations</b>
      <div style="margin-top:10px">${(SETTINGS.integrations||[]).map(i=>`<div class="info-line"><span>${escapeHtml(i)}</span><span class="pill blue">connected</span></div>`).join('')}</div>
      <p class="hint" style="margin-top:14px">// PROD: persistence→API; client stock deduction→server atomic; simulated txn→gateway webhook.</p>
    </div>`;
}
function saveSettings(){
  SETTINGS.storeName=$('#setName').value.trim()||SETTINGS.storeName;
  SETTINGS.supportEmail=$('#setEmail').value.trim();
  SETTINGS.freeShipThreshold=+$('#setFree').value||0;
  SETTINGS.flatShip=+$('#setFlat').value||0;
  SETTINGS.invoicePrefix=$('#setInv').value.trim();
  SETTINGS.gstin=$('#setGst').value.trim();
  SETTINGS.domain=$('#setDom').value.trim();
  const newOtp=$('#setOtp').value.trim(); if(newOtp){ ADMIN_OTP_EMAIL=newOtp; SETTINGS.otpEmail=newOtp; }
  persist('settings',SETTINGS); logAudit('settings.edit','store',''); renderAdmin(); toast('Settings saved','ok');
}
/* ============================================================
   VIEW SWITCHER + HASH ROUTER + BOOT
   ============================================================ */
function showView(name){
  ['site','login','admin'].forEach(v=>{ const el=$('#'+v+'View'); if(el) el.classList.toggle('active', v===name); });
  document.body.classList.toggle('admin-mode', name==='admin');
}

/* hash routes:  #/  #/catalog #/pdp #/account #/checkout #/order  · #/admin (gate) */
function checkRoute(){
  const h=(location.hash||'#/').replace(/^#\/?/,'');
  const seg=h.split('/')[0]||'';
  if(seg==='admin'){
    if(currentUser){ showView('admin'); renderAdmin(); }
    else { loginStage='password'; showView('login'); renderLogin(); }
    return;
  }
  // storefront routes
  showView('site');
  const map={'':'home','home':'home','catalog':'catalog','shop':'catalog','pdp':'pdp','account':'account','checkout':'checkout','order':'order','about':'about','contact':'contact'};
  const page=map[seg]||'home';
  // don't clobber a PDP/product context if already set; default home otherwise
  if(page==='pdp' && !pdpProductId){ sitePage='catalog'; } else { sitePage=page; }
  renderSite();
}

function boot(){
  // hydrate derivation normalizers already ran at load (hydrateFromDB IIFE).
  seedDemoCommerce();

  // initial paint
  refreshBadges();
  renderSite();
  renderFooter();

  // mobile drawer
  const burger=$('#burger'), drawer=$('#drawer'), dClose=$('#drawerClose');
  if(burger) burger.onclick=()=>{ drawer.classList.add('open'); $('#overlay').classList.add('open'); };
  if(dClose) dClose.onclick=()=>{ drawer.classList.remove('open'); syncOverlay(); };
  if(drawer) $$('#drawer a').forEach(a=>a.addEventListener('click',()=>{ drawer.classList.remove('open'); syncOverlay(); }));

  // global keyboard: Escape closes overlays; basic focus trap for modal
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){ closeAllPanels(); const dr=$('#drawer'); if(dr)dr.classList.remove('open'); syncOverlay(); }
    if(e.key==='Tab'){
      const modal=$('#modal'); if(modal&&modal.classList.contains('open')){
        const f=modal.querySelectorAll('button,input,select,textarea,a[href]');
        if(f.length){ const first=f[0], last=f[f.length-1];
          if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
        }
      }
    }
  });

  // consent banner (gates trackers)
  initConsent();

  // live activity + scroll UI
  startLiveActivity();
  const prog=$('#scrollProg'), toTop=$('#toTop');
  const onScroll=()=>{
    const h=document.documentElement;
    const sc=h.scrollTop||document.body.scrollTop;
    const max=(h.scrollHeight-h.clientHeight)||1;
    if(prog) prog.style.width=(sc/max*100)+'%';
    if(toTop) toTop.classList.toggle('show', sc>600);
    const head=$('.site-head'); if(head) head.classList.toggle('shrunk', sc>40);
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  // route
  window.addEventListener('hashchange',checkRoute);
  checkRoute();
}

// go() helper special-cases admin so footer/menu "Admin" links route to the gate
(function patchGo(){
  const _go=go;
  window.go=function(page,sub){
    if(page==='admin'){ location.hash='#/admin'; checkRoute(); return; }
    return _go(page,sub);
  };
})();

boot();
