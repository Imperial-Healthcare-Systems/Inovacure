// Beat 9 (human-requested 2026-07-14) — FAQ before the footer. Native
// <details>/<summary> accordions: keyboard + no-JS + reduced-motion all work
// by default. Every answer is grounded in confirmed material (commerce model,
// verticals, live segments, approved profile copy) — no invented facts; copy
// is presented for human sign-off like all copy.
const FAQS = [
  {
    q: "Can I buy Inovacure products online?",
    a: "We don't sell online. Inovacure works through doctors, pharmacies, distributors and export partners — send an enquiry or reach us on WhatsApp and we'll route you to the right channel.",
  },
  {
    q: "How do I become a distributor?",
    a: "Start a distribution enquiry through the form on our contact page. Tell us your territory and current portfolio, and our team will get back to you with next steps.",
  },
  {
    q: "Do you supply to international markets?",
    a: "Yes — pharma exports are one of our four business verticals. We supply quality-assured formulations through compliant export channels; start an export enquiry to discuss your market.",
  },
  {
    q: "Which therapeutic segments do you cover?",
    a: "Eye care & vision wellness and paediatric nutrition are live today, with cardiology, orthopaedics, diabetology and dermatology expanding next. The product catalog shows the current range.",
  },
  {
    q: "How is product quality assured?",
    a: "Our products are tested for efficacy and potency and held to strict standards for safety and effectiveness — quality is engineered in from formulation to finished pack.",
  },
  {
    q: "I'm a doctor — how do I get product information?",
    a: "Use the clinical enquiry track and our team will share evidence-led product information and support for your practice and patients.",
  },
];

export default function Faq() {
  return (
    <section className="hc-block hc-faq">
      <div className="wrap">
        <span className="eyebrow" data-reveal>
          Answers
        </span>
        <h2 data-reveal>Frequently asked questions</h2>
        <div className="hc-faqlist">
          {FAQS.map((f) => (
            // name groups the accordions natively: opening one closes the rest
            <details className="hc-faqitem" name="hc-faq" key={f.q} data-reveal>
              <summary>
                {f.q}
                <span className="hc-faqmark" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
