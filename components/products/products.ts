// First-launch catalog data — the THREE confirmed products only (brief:
// first_launch_products; facts read off the client's own pack shot in
// assets/imagery/product-range.jpg). No invented products: the comp's 8-card
// grid was explicit comp-filler. New entries land here as the fact sheet /
// leaflets confirm them. No prices anywhere (open decision; sector norm is
// pack size + enquire).
export type Product = {
  slug: string;
  brand: string;
  name: string;
  segment: string;
  form: string;
  range: "Ethical" | "Nutraceutical";
  pack: string;
  blurb: string;
  badge?: string;
  logo: string;
  /** object-position into the shared range photograph for the PDP media */
  shotPos: string;
  facts: [string, string][];
  features: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "oclean",
    brand: "Oclean",
    name: "Oclean Lubricating & Soothing Eye Drops",
    segment: "Ophthalmology",
    form: "Drops",
    range: "Ethical",
    pack: "10 ml",
    blurb: "Lubricating & soothing · sterile eye drops",
    badge: "First launch",
    logo: "/assets/products/first-launch/oclean.jpeg",
    shotPos: "12% 50%",
    facts: [
      ["Dosage form", "Sterile lubricating eye drops"],
      ["Pack", "10 ml dropper bottle"],
      ["Segment", "Ophthalmology — eye care"],
      ["Range", "Ethical — through clinicians & pharmacies"],
      ["Availability", "Through clinics, pharmacies and distribution partners"],
    ],
    features: [
      "Lubricates and soothes the eyes",
      "Sterile ophthalmic preparation",
      "Convenient 10 ml dropper pack",
      "Part of the first Inovacure launch range",
    ],
  },
  {
    slug: "hytran",
    brand: "Hytran",
    name: "Hytran Lubricant Eye Drops",
    segment: "Ophthalmology",
    form: "Drops",
    range: "Ethical",
    pack: "10 ml",
    blurb: "Lubricant eye drops · sterile formula",
    badge: "First launch",
    logo: "/assets/products/first-launch/hytran.jpeg",
    shotPos: "50% 50%",
    facts: [
      ["Dosage form", "Sterile lubricant eye drops"],
      ["Pack", "10 ml dropper bottle"],
      ["Segment", "Ophthalmology — dry-eye care"],
      ["Range", "Ethical — through clinicians & pharmacies"],
      ["Availability", "Through clinics, pharmacies and distribution partners"],
    ],
    features: [
      "Lubricant relief for dry, tired eyes",
      "Sterile ophthalmic preparation",
      "Convenient 10 ml dropper pack",
      "Part of the first Inovacure launch range",
    ],
  },
  {
    slug: "kidzea",
    brand: "Kidzea",
    name: "Kidzea DHA Jellies — Paediatric",
    segment: "Paediatric nutrition",
    form: "Jellies",
    range: "Nutraceutical",
    pack: "30 jellies",
    blurb: "DHA jellies · strawberry flavour",
    badge: "First launch",
    logo: "/assets/products/first-launch/kidzea.jpeg",
    shotPos: "88% 50%",
    facts: [
      ["Dosage form", "DHA jellies — paediatric"],
      ["Flavour", "Strawberry"],
      ["Pack", "30 jellies"],
      ["Segment", "Paediatric nutrition"],
      ["Range", "Nutraceutical — wellness & nutrition"],
    ],
    features: [
      "DHA nutrition in a jelly format kids accept",
      "Strawberry flavour",
      "30-jelly pack for a steady routine",
      "Part of the first Inovacure launch range",
    ],
  },
];

export const bySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);
