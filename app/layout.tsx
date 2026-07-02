import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inovacure.com"),
  title: "Inovacure Pharmaceuticals — Affordable Medicines, Healthier Lives",
  description:
    "Inovacure Pharmaceuticals LLP develops and distributes high-quality, affordable medicines across dermatology, eye care, wellness and more. Shop trusted pharma products online.",
  keywords:
    "pharmaceutical company India, affordable medicines, eye care products, dermatology, OTC drugs, nutraceuticals, Inovacure, buy medicine online",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Inovacure Pharmaceuticals — Affordable Medicines, Healthier Lives",
    description:
      "High-quality, affordable medicines across multiple therapeutic segments. Trusted by patients, clinics and pharmacies.",
    url: "https://www.inovacure.com/",
    locale: "en_IN",
    images: ["https://www.inovacure.com/assets/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inovacure Pharmaceuticals",
    description: "Affordable, quality-assured medicines online.",
  },
};

export const viewport: Viewport = {
  themeColor: "#004497",
  width: "device-width",
  initialScale: 1,
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: "Inovacure Pharmaceuticals LLP",
  image: "https://www.inovacure.com/assets/logo.png",
  description:
    "Healthcare-focused pharmaceutical company developing, manufacturing and distributing high-quality, affordable medicines across multiple therapeutic segments.",
  slogan: "Affordable Medicines, Healthier Lives Worldwide.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-116, Urbtech Trade Centre, Sector 132, Noida Expressway",
    addressLocality: "Gautam Buddha Nagar",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  email: "harun.riaz@outlook.com",
  telephone: "+91-9599597879",
  url: "https://www.inovacure.com/",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Spline+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
