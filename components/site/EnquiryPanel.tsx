"use client";

// Intent-segmented enquiry panel (brief: export buyers · distributors/PCD ·
// doctors/prescribers · general). INTERIM submit: composes a pre-filled
// email to info@inovacure.in — honest and functional without a backend; the
// live capture (server action, then Supabase) lands in the enquiry-system
// beat and swaps in behind this same UI.
import { useState } from "react";

const TRACKS = [
  {
    key: "export",
    label: "Export buyer",
    desc: "International distribution & registration",
    subject: "Export enquiry",
    hint: "Your market, products of interest and volumes",
  },
  {
    key: "distributor",
    label: "Distributor / PCD",
    desc: "Territory distribution within India",
    subject: "Distribution enquiry",
    hint: "Your territory, channel and current lines",
  },
  {
    key: "doctor",
    label: "Doctor / Pharmacy",
    desc: "Product information & stocking",
    subject: "Clinician & pharmacy enquiry",
    hint: "Your practice or pharmacy and products of interest",
  },
  {
    key: "general",
    label: "Something else",
    desc: "Careers, media, anything at all",
    subject: "General enquiry",
    hint: "Tell us what brings you here",
  },
];

export default function EnquiryPanel() {
  const [track, setTrack] = useState(TRACKS[0]);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = () => {
    const subject = encodeURIComponent(`[${track.subject}] ${org || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganisation: ${org}\nTrack: ${track.label}\n\n${msg}`,
    );
    return `mailto:info@inovacure.in?subject=${subject}&body=${body}`;
  };

  return (
    <div className="hc-enqpanel" id="enquiry">
      <div className="hc-lanes" role="tablist" aria-label="Enquiry type">
        {TRACKS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={track.key === t.key}
            className={`hc-lane${track.key === t.key ? " on" : ""}`}
            onClick={() => setTrack(t)}
          >
            <b>{t.label}</b>
            <span>{t.desc}</span>
          </button>
        ))}
      </div>
      <form
        className="hc-enqform"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = mailto();
        }}
      >
        <label>
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
          />
        </label>
        <label>
          <span>Organisation</span>
          <input
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Clinic, pharmacy, company…"
          />
        </label>
        <label className="hc-wide">
          <span>Message</span>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            required
            rows={5}
            placeholder={track.hint}
          />
        </label>
        <div className="hc-wide hc-enqfoot">
          <button className="btn btn-primary" type="submit">
            Compose your enquiry
          </button>
          <small>
            Opens your email app addressed to info@inovacure.in with your
            message ready to send — nothing is stored on this site.
          </small>
        </div>
      </form>
    </div>
  );
}
