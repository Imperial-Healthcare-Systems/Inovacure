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

  // Approx. pin: Urbtech Trade Centre (UTC), Sector 132, Noida Expressway.
  // Filled from the shared Google pin; refine if the listing is repositioned.
  geo: { lat: 28.5106, lng: 77.3891 },
} as const;

// The building landmark geocodes more precisely than the unit-prefixed address,
// so map queries key off it. The pin can be "tweaked later" by editing this one
// string — every map/link URL below is derived from it.
const MAP_QUERY =
  "Urbtech Trade Centre, Sector 132, Noida Expressway, Uttar Pradesh 201301";

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
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`,
  placeUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
} as const;

// Pre-filled WhatsApp chat link (opens wa.me → app/web with a starter message).
export const WHATSAPP_URL = `https://wa.me/${COMPANY.whatsapp.digits}?text=${encodeURIComponent(
  "Hi Inovacure, I'd like to enquire about",
)}`;
