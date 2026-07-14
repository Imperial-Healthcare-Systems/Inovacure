"use client";

// Motion runtime for the corporate rebuild (ylem SiteRuntime pattern, re-skinned).
// Owns ALL gsap/Lenis wiring: sections stay server components and only carry
// data-attributes. Floors: prefers-reduced-motion gets the end-state (no Lenis,
// no tweens); window.__forceReveal jumps everything to end-state for honest
// full-page screenshots.
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

declare global {
  interface Window {
    __forceReveal?: () => void;
  }
}

const LOAD_SEQ = "[data-load-seq]";
const REVEAL = "[data-reveal]";

export default function SiteRuntime() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // end-state is the markup itself — nothing to unwind

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const brand =
      CustomEase.get("brand") ?? CustomEase.create("brand", "0.2,0.7,0.3,1");

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let introTl: gsap.core.Timeline | null = null;
    const scrollFx: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      // Intro choreography. With [data-hero-dawn] the load sequence rides a
      // dawn build-up — night fades, stars dim to atmosphere, the sun rises
      // through the arcs into the banner state ("A New Sun is Born", literally).
      // CSS holds the end state, so no-JS and reduced-motion both see daylight.
      const dawn = document.querySelector<HTMLElement>("[data-hero-dawn]");
      const tl = gsap.timeline({
        defaults: { ease: "brand" },
        // inline styles own every animated element from here on — drop the
        // SSR bridge class so CSS end-state rules can't fight clearProps later
        onComplete: () => document.documentElement.classList.remove("hc-intro"),
      });
      introTl = tl;
      let contentAt = 0.15;
      if (dawn) {
        const night = dawn.querySelector(".hc-night");
        const stars = dawn.querySelector(".hc-stars");
        const sun = dawn.querySelector(".hc-sun");
        const arcs = dawn.querySelectorAll(".hc-arcs i");
        const nav = dawn.querySelector(".hc-nav");
        tl.set(night, { opacity: 1 }, 0)
          .set(stars, { opacity: 1 }, 0)
          .fromTo(
            sun,
            // hazy while below the horizon, sharp at daylight — the end of the
            // intro must land crisp, so the blur animates fully out and the
            // rasterized animation layer is dropped on complete (clearProps).
            // y:0 is load-bearing: the .hc-intro bridge positions the sun via
            // translateY(14vw), which gsap parses into the separate `y`
            // channel — left alone it survives the rise and snaps at cleanup.
            { yPercent: 22, y: 0, scale: 0.82, opacity: 0.15, filter: "blur(26px)" },
            {
              yPercent: 0,
              scale: 1,
              opacity: 0.9,
              filter: "blur(0px)",
              duration: 2.6,
            },
            0,
          )
          .fromTo(
            arcs,
            { scale: 0.93, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.7, stagger: 0.16 },
            0.35,
          )
          .to(night, { opacity: 0, duration: 2.3 }, 0.4)
          .to(stars, { opacity: 0.25, duration: 1.9 }, 0.8);
        if (nav)
          tl.fromTo(
            nav,
            { y: -18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7 },
            0.3,
          );
        // At daylight: drop the bridge class FIRST, then de-rasterize the sun
        // and arcs (clearProps kills the blurry GPU animation layers). Order
        // matters — clearing while .hc-intro is still on <html> would let the
        // bridge CSS snap the sun back to its night state.
        // The scroll parallax is created only NOW: building it during the
        // intro made it capture the night yPercent as its start, which
        // snapped the sun low→high at the end of the build-up.
        tl.eventCallback("onComplete", () => {
          document.documentElement.classList.remove("hc-intro");
          gsap.set(sun, { clearProps: "transform,filter" });
          gsap.set(arcs, { clearProps: "transform" });
          scrollFx.push(
            gsap.fromTo(
              sun,
              { yPercent: 0 },
              {
                yPercent: 12,
                ease: "none",
                scrollTrigger: { trigger: dawn, start: "top top", end: "bottom top", scrub: true },
              },
            ),
            gsap.to(dawn.querySelector(":scope > .wrap"), {
              y: -60,
              autoAlpha: 0.35,
              ease: "none",
              scrollTrigger: { trigger: dawn, start: "top top", end: "bottom 25%", scrub: true },
            }),
          );
        });
        contentAt = 1.05; // copy arrives while the sun is still rising
      }
      const seq = gsap.utils.toArray<HTMLElement>(LOAD_SEQ);
      seq.forEach((el, i) => {
        const isMask = el.hasAttribute("data-mask");
        tl.fromTo(
          el,
          isMask
            ? { autoAlpha: 1, y: 44, clipPath: "inset(0 0 100% 0)" }
            : { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: isMask ? "inset(-5% 0 -10% 0)" : undefined,
            duration: isMask ? 0.9 : 0.7,
          },
          i === 0 ? contentAt : "-=0.45",
        );
      });


      // Full-bleed band parallax + slow ken-burns: image drifts against the
      // scroll and breathes a few percent larger across its pass.
      gsap.utils.toArray<HTMLElement>("[data-band-parallax]").forEach((band) => {
        const img = band.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.04 },
          {
            yPercent: 6,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Stat counters: markup holds the final honest value (no-JS/RM see it
      // as-is); on first scroll into view the number counts up to it.
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const raw = el.textContent ?? "";
        const num = parseInt(raw, 10);
        if (isNaN(num)) return;
        el.dataset.final = raw;
        const suffix = raw.replace(String(num), "");
        const state = { v: 0 };
        gsap.to(state, {
          v: num,
          duration: 1.4,
          ease: "brand",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(state.v) + suffix;
          },
        });
      });

      // Scroll reveals: batched entrance choreography by viewport band.
      // data-reveal="mask" upgrades to a clip-mask rise (headline treatment);
      // revealed elements also gain .hc-in for CSS state hooks (numeral
      // ignition etc.).
      const revealEls = gsap.utils.toArray<HTMLElement>(REVEAL);
      const maskEls = revealEls.filter((el) => el.dataset.reveal === "mask");
      const plainEls = revealEls.filter((el) => el.dataset.reveal !== "mask");
      if (plainEls.length) {
        gsap.set(plainEls, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(plainEls, {
          start: "top 86%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => (el as HTMLElement).classList.add("hc-in"));
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "brand",
              stagger: 0.09,
            });
          },
        });
      }
      maskEls.forEach((el) => {
        gsap.set(el, { clipPath: "inset(0 0 100% 0)", y: 34 });
        gsap.to(el, {
          clipPath: "inset(-5% 0 -10% 0)",
          y: 0,
          duration: 0.9,
          ease: "brand",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
          onStart: () => el.classList.add("hc-in"),
        });
      });

      // Scroll-drawn lines (e.g. the steps connector): scaleX scrubs with the
      // section's pass through the viewport.
      gsap.utils.toArray<HTMLElement>("[data-drawline]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: line.parentElement,
              start: "top 82%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );
      });
    });

    // Honest-screenshot hook (shoot scripts call this before fullPage capture).
    window.__forceReveal = () => {
      document.documentElement.classList.remove("hc-intro");
      introTl?.progress(1); // dawn build-up jumps to full daylight
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        if (el.dataset.final) el.textContent = el.dataset.final;
      });
      gsap.set([...gsap.utils.toArray(LOAD_SEQ), ...gsap.utils.toArray(REVEAL)], {
        clearProps: "all",
        autoAlpha: 1,
        y: 0,
        clipPath: "none",
      });
      gsap.set("[data-drawline]", { scaleX: 1 });
      gsap.utils
        .toArray<HTMLElement>(REVEAL)
        .forEach((el) => el.classList.add("hc-in"));
    };

    return () => {
      document.documentElement.classList.remove("hc-intro");
      delete window.__forceReveal;
      // parallax tweens are created after mount (intro onComplete), outside
      // the gsap context — kill them and their triggers explicitly
      scrollFx.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
