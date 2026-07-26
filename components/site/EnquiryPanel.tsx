"use client";

// Intent-segmented enquiry panel (brief: export buyers · distributors/PCD ·
// doctors/prescribers · general). Submitting persists to Supabase via a server
// action when the DB is configured; if it isn't (or the write fails), it falls
// back to composing a pre-filled email to info@inovacure.in — so the form always
// works. The UI is unchanged either way.
import { useState } from "react";
import { submitEnquiry } from "@/lib/actions/enquiry";

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
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const mailto = () => {
    const subject = encodeURIComponent(`[${track.subject}] ${org || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganisation: ${org}\nEmail: ${email}\nTrack: ${track.label}\n\n${msg}`,
    );
    return `mailto:info@inovacure.in?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await submitEnquiry({
        track: track.key,
        name,
        organisation: org,
        email,
        message: msg,
      });
      if (res.ok) {
        setStatus("sent");
        setName("");
        setOrg("");
        setEmail("");
        setMsg("");
        return;
      }
      // Not configured yet (or a write error) → fall back to the email compose.
      if (res.reason === "unconfigured" || res.reason === "error") {
        window.location.href = mailto();
        setStatus("idle");
        return;
      }
      setStatus("error"); // validation
    } catch {
      window.location.href = mailto();
      setStatus("idle");
    }
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
      <form className="hc-enqform" onSubmit={onSubmit}>
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
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
          <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send your enquiry"}
          </button>
          {status === "sent" ? (
            <small>Thanks — your enquiry has reached our team. We&rsquo;ll be in touch.</small>
          ) : status === "error" ? (
            <small>Please add your name and a short message, then try again.</small>
          ) : (
            <small>
              We&rsquo;ll record your enquiry and get back to you. If our system
              isn&rsquo;t reachable, this opens your email app to info@inovacure.in instead.
            </small>
          )}
        </div>
      </form>
    </div>
  );
}
