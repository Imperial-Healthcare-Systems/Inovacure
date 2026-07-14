import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/home/sections/Footer";
import EnquiryPanel from "@/components/site/EnquiryPanel";

export const metadata: Metadata = {
  title: "Contact — Inovacure Pharmaceuticals",
  description:
    "For product enquiries, distribution, exports or partnership — we'd be glad to hear from you. Inovacure Pharmaceuticals LLP, Noida, India.",
};

// Company page — Contact: the conversion hub every /contact#enquiry CTA on
// the site lands on. Contact facts strictly per the corrections doc (email +
// registered office + domain); phone/WhatsApp appear only once the canonical
// number is confirmed on the fact sheet.
export default function ContactPage() {
  return (
    <>
      <SiteHeader active="contact" />

      <header className="hc-pagehead hc-split">
        <div className="hc-arc" aria-hidden="true"></div>
        <div className="hc-arc g" aria-hidden="true"></div>
        <div className="wrap">
          <div className="hc-headtext">
            <div className="hc-crumb">
              <a href="/">Home</a> · <b>Contact</b>
            </div>
            <span className="hc-kick">Contact Inovacure</span>
            <h1>We&rsquo;d be glad to hear from you.</h1>
            <p className="hc-lead">
              For product enquiries, distribution, exports or partnership —
              one message starts it. Real people read these, and a named
              contact answers.
            </p>
          </div>
        </div>
        {/* PLACEHOLDER (manifest: stock-extras) — a person, not a switchboard */}
        <div className="hc-headimg" data-band-parallax aria-hidden="true">
          <img
            src="/assets/imagery/smiling-clinician.jpg"
            alt=""
            style={{ objectPosition: "center 22%" }}
          />
        </div>
      </header>

      <section className="hc-block">
        <div className="wrap">
          <div className="hc-rails">
            <a className="hc-rail" href="mailto:info@inovacure.in" data-reveal>
              <span className="hc-ic" aria-hidden="true">✉</span>
              <b>Email us</b>
              <p>info@inovacure.in</p>
              <span className="hc-railcta">Write to us →</span>
            </a>
            <div className="hc-rail" data-reveal>
              <span className="hc-ic" aria-hidden="true">◎</span>
              <b>Registered office</b>
              <p>
                A-116, URB Trade Centre, Sector 132,
                <br />
                Noida, Gautam Budh Nagar, UP 201304
              </p>
              <span className="hc-railcta">Inovacure Pharmaceuticals LLP</span>
            </div>
            <div className="hc-rail" data-reveal>
              <span className="hc-ic" aria-hidden="true">☏</span>
              <b>Phone &amp; WhatsApp</b>
              <p>
                Publishing shortly — until then, email reaches the same desk
                and gets the same named contact.
              </p>
              <span className="hc-railcta">Every enquiry answered</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hc-block hc-proof">
        <div className="wrap">
          <span className="eyebrow" data-reveal>
            Enquiry desk
          </span>
          <h2 data-reveal="mask">Tell us who you are — we&rsquo;ll take it from there.</h2>
          <p className="hc-enqlead" data-reveal>
            Pick the lane that fits and your enquiry lands with the right desk
            on the first try.
          </p>
          <EnquiryPanel />
        </div>
      </section>

      <Footer />
    </>
  );
}
