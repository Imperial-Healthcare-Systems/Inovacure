// Single source of truth for company contact facts. Introduced with the Google
// Maps integration to end the address drift that had "URB Trade Centre / 201304"
// duplicated (and out of sync) across layout, footer and the contact page.
// Update a fact HERE and every surface follows. Registered address confirmed
// 2026-07-27 against the GST registration: "Urbtech Trade Centre", PIN 201301.

export const COMPANY = {
  legalName: "Inovacure Pharmaceuticals LLP",
  slogan: "Live Healthy.",

  email: "info@inovacure.in",
  website: "https://www.inovacure.in",
  websiteDisplay: "inovacure.in",

  // WhatsApp only for now — voice-call reachability of this number is not yet
  // confirmed, so no tel:/JSON-LD telephone is asserted anywhere (facts policy).
  whatsapp: {
    e164: "+91 81784 57542",
    digits: "918178457542",
  },

  // Structured address (schema.org PostalAddress shape) + display forms.
  address: {
    unit: "A-116",
    streetAddress: "A-116, Urbtech Trade Centre, Noida Expressway, Sector 132",
    locality: "Gautam Buddha Nagar, Noida",
    region: "Uttar Pradesh",
    // 201301 is the GST-registered PIN and is deliberate. The Google Maps
    // listing for the same building states 201304 — do NOT "correct" this to
    // match it. Checked again 2026-08-05 when the pin was re-sourced from that
    // listing; the registered address stays authoritative for PostalAddress.
    postalCode: "201301",
    country: "IN",
    // Two-line display used on the contact/office surfaces.
    lines: [
      "A-116, Urbtech Trade Centre, Noida Expressway, Sector 132",
      "Gautam Buddha Nagar, Uttar Pradesh 201301",
    ] as const,
    // Compact single-line form for the footer.
    oneLine:
      "A-116, Urbtech Trade Centre, Noida Expressway, Sector 132, Noida, UP 201301",
  },

  // Exact pin for the "Urbtech Trade Centre" Google listing shared by the
  // client on 2026-08-05 (maps.app.goo.gl/65D2nQN2GG4JNtqs9), read from that
  // place's !3d/!4d payload. Supersedes an approximate pin that sat ~1.3 km
  // south-east of the building. Every map link + the JSON-LD GeoCoordinates
  // derive from this pair, so re-pinning means editing only these two numbers.
  geo: { lat: 28.5160762, lng: 77.3770456 },
} as const;

// Human-readable destination label. Display/fallback only — the deep-links no
// longer geocode this string, because a text query is re-resolved by Google on
// every click and can silently land somewhere else. They key off COMPANY.geo
// and the canonical listing below instead, so the pin cannot drift.
const MAP_QUERY =
  "Urbtech Trade Centre, Sector 132, Noida Expressway, Uttar Pradesh 201301";

// The office's canonical Google Maps listing, exactly as shared by the client.
// Opening this (rather than a search query) guarantees the business card —
// name, photos, reviews — resolves to the intended place every time.
const GOOGLE_PLACE_URL = "https://maps.app.goo.gl/65D2nQN2GG4JNtqs9";

// Google's keyless "output=embed" iframe stopped working: it now 301-redirects
// to /maps/embed?pb=… which returns X-Frame-Options: SAMEORIGIN, so browsers
// refuse to frame it and the map renders blank. We embed OpenStreetMap instead
// (also keyless/zero-billing, but frameable and it renders a marker at the pin);
// Google still powers the interactive deep-links below. bbox is ~2:1 to match
// the map frame's 16/8 aspect. Swap embedSrc back to a Google Share→Embed `pb`
// iframe here if/when a branded Google embed is wanted.
const { lat: PIN_LAT, lng: PIN_LNG } = COMPANY.geo;
const OSM_BBOX = [PIN_LNG - 0.012, PIN_LAT - 0.006, PIN_LNG + 0.012, PIN_LAT + 0.006]
  .map((n) => n.toFixed(5))
  .join(",");

export const MAP = {
  query: MAP_QUERY,
  // Embedded preview: OpenStreetMap with a marker at COMPANY.geo (see note above).
  embedSrc: `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    OSM_BBOX,
  )}&layer=mapnik&marker=${PIN_LAT}%2C${PIN_LNG}`,
  // Deep links (Google — universal Maps URLs; open the app on mobile, web else).
  // Directions route to the exact coordinates rather than a place name, so the
  // arrival point is the building itself and not a re-geocoded approximation.
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${PIN_LAT},${PIN_LNG}`,
  )}`,
  placeUrl: GOOGLE_PLACE_URL,
} as const;

// Official social profiles. Surfaced in the footer and as schema.org `sameAs`
// on the Organization entity, which is how search engines tie these accounts to
// the company — so only add a profile that is genuinely ours and public.
//
// Facebook: the client supplied the profile.php?id=… form; Facebook itself
// 302s that to the canonical /people/<name>/<id>/ URL, which is what's stored.
// The numeric id is the permanent part, so a page rename won't break it.
export const SOCIAL = [
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/people/Inovacure-Pharmaceuticals/61592259660397/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    // The page's public vanity URL. Deliberately NOT the numeric-id form
    // (/company/142925049/), and emphatically not the /admin/dashboard/ link
    // this was first given as — that one is the page-management back-end and
    // drops every non-admin on a sign-up wall. Only the vanity slug is
    // reliably reachable by logged-out visitors and by search engines, which
    // is what `sameAs` needs to verify the account belongs to us.
    href: "https://www.linkedin.com/company/inovacure-pharmaceuticals",
  },
] as const;

// Pre-filled WhatsApp chat link (opens wa.me → app/web with a starter message).
export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp.digits}?text=${encodeURIComponent(
  "Hi Inovacure, I'd like to enquire about",
)}`;
