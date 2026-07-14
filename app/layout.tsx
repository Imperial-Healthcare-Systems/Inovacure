import type { Metadata, Viewport } from "next";
import { Archivo, Spline_Sans } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spline-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inovacure.in"),
  title: "Inovacure Pharmaceuticals — Affordable Medicines, Healthier Lives",
  description:
    "Inovacure Pharmaceuticals LLP develops, markets and distributes high-quality, affordable medicines across multiple therapeutic segments — ethical formulations, nutraceuticals, APIs and pharma exports.",
  keywords:
    "pharmaceutical company India, affordable medicines, ethical pharmaceuticals, nutraceuticals, API supplier, pharma exports, Inovacure",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Inovacure Pharmaceuticals — Affordable Medicines, Healthier Lives",
    description:
      "High-quality, affordable medicines across multiple therapeutic segments. Trusted by patients, clinics and pharmacies.",
    url: "https://www.inovacure.in/",
    locale: "en_IN",
    images: ["https://www.inovacure.in/assets/logo-horizontal.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inovacure Pharmaceuticals",
    description:
      "Affordable, quality-assured medicines across ethical formulations, nutraceuticals, APIs and exports.",
  },
};

export const viewport: Viewport = {
  themeColor: "#004497",
  width: "device-width",
  initialScale: 1,
};

// Organization (NOT "Pharmacy" — that schema type signals a dispensing/online
// pharmacy, which the repositioning explicitly rejects; Inovacure is a
// pharmaceutical company, enquiry-driven, no public commerce). telephone is
// omitted until the canonical number is confirmed on the fact sheet (facts
// policy: never assert an unverified fact). Address matches the "URB Trade
// Centre" spelling used across every built page (the "Urbtech" variant is TBC).
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Inovacure Pharmaceuticals LLP",
  image: "https://www.inovacure.in/assets/logo-horizontal.png",
  description:
    "Healthcare-focused pharmaceutical company developing, marketing and distributing high-quality, affordable medicines across multiple therapeutic segments — ethical formulations, nutraceuticals, APIs and pharma exports.",
  slogan: "Live Healthy.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-116, URB Trade Centre, Sector 132",
    addressLocality: "Gautam Budh Nagar, Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201304",
    addressCountry: "IN",
  },
  email: "info@inovacure.in",
  url: "https://www.inovacure.in/",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the preview intro script stamps a class on
    // <html> before hydration (pre-paint dawn state) — expected mismatch only.
    <html
      lang="en"
      className={`${archivo.variable} ${splineSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
