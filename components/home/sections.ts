import type { ComponentType } from "react";
import Hero from "./sections/Hero";
import Certs from "./sections/Certs";
import Verticals from "./sections/Verticals";
import ImageBand from "./sections/ImageBand";
import Reach from "./sections/Reach";
import Diff from "./sections/Diff";
import Enquiry from "./sections/Enquiry";
import Faq from "./sections/Faq";
import Footer from "./sections/Footer";

// V3 beat registry for the Home page (order = approved comp home-C.html).
// `approved` flips to true only after the human signs off the beat's preview —
// the accumulating page at /preview/home renders approved sections verbatim,
// while /preview/home/section/<slug> renders any section standalone for review.
export type HomeSection = {
  slug: string;
  title: string;
  Component: ComponentType;
  approved: boolean;
};

export const HOME_SECTIONS: HomeSection[] = [
  // human-signed 2026-07-14 (v2: dawn build-up, logo chip, crisp ending)
  { slug: "hero", title: "Nav + Hero", Component: Hero, approved: true },
  // human-signed 2026-07-14
  { slug: "certs", title: "Certifications strip", Component: Certs, approved: true },
  // human-signed 2026-07-14
  { slug: "verticals", title: "Verticals grid", Component: Verticals, approved: true },
  // human-signed 2026-07-14
  { slug: "band", title: "Editorial image band", Component: ImageBand, approved: true },
  // human-signed 2026-07-14
  { slug: "reach", title: "Therapeutic reach", Component: Reach, approved: true },
  // human-signed 2026-07-14 (rev 3: held-hands-care image, human-picked)
  { slug: "diff", title: "Differentiators + vision", Component: Diff, approved: true },
  // human-signed 2026-07-14
  { slug: "enquiry", title: "Enquiry tracks", Component: Enquiry, approved: true },
  // human-signed 2026-07-14 (copy approved; exclusive accordions)
  { slug: "faq", title: "FAQ", Component: Faq, approved: true },
  // human-signed 2026-07-14 (enhanced rev 2: footarcs, dash headers, back-to-top)
  { slug: "footer", title: "Footer", Component: Footer, approved: true },
];
