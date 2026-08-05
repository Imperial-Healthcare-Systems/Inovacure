"use client";

// Intent-segmented enquiry panel (brief: export buyers · distributors/PCD ·
// doctors/prescribers · general). Submitting emails the enquiry to the team via
// a server action (SMTP); if mail isn't configured or the send fails, it falls
// back to composing a pre-filled email to info@inovacure.in — so the form always
// works. The UI is unchanged either way.
import { useState } from "react";
import { submitEnquiry } from "@/lib/actions/enquiry";
import { ENQUIRY_TRACKS, type EnquiryTrackDef } from "@/lib/site/enquiry-tracks";
import { COMPANY } from "@/lib/site/company";

export default function EnquiryPanel() {
  const [track, setTrack] = useState<EnquiryTrackDef>(ENQUIRY_TRACKS[0]);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  // Honeypot. Never shown, never focusable — anything in it means a bot.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const mailto = () => {
    const subject = encodeURIComponent(`[${track.subject}] ${org || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganisation: ${org}\nEmail: ${email}\nTrack: ${track.label}\n\n${msg}`,
    );
    return `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
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
        website,
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
        {ENQUIRY_TRACKS.map((t) => (
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
        {/* Honeypot: off-screen, untabbable and hidden from assistive tech, so
            no human ever fills it. A submission that does is dropped silently. */}
        <div className="hc-hp" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>
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
              Your enquiry goes straight to our team and we&rsquo;ll get back to
              you. If our mail server isn&rsquo;t reachable, this opens your email
              app to {COMPANY.email} instead.
            </small>
          )}
        </div>
      </form>
    </div>
  );
}
