"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { OPENING } from "@/content/opening";
import { DotBrain, type DotBrainHandle } from "./DotBrain";
import { LiveCounter } from "./LiveCounter";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Share of dots still lit once the reader has scrolled past the opening. */
const MIN_LIT = 0.15;
const ECG =
  "M0,50 H280 L300,50 L314,14 L330,84 L344,30 L356,50 H520 L538,50 L552,8 L568,88 L582,24 L596,50 H760 L776,50 L786,36 L798,62 L808,50 H1000";

export function Opening() {
  const rootRef = useRef<HTMLElement>(null);
  const brainRef = useRef<DotBrainHandle>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => brainRef.current?.setLit(1 - (1 - MIN_LIT) * self.progress),
      });
    },
    { scope: rootRef },
  );

  return (
    <header className="opening" ref={rootRef}>
      <div className="opening-inner">
        <div className="opening-brand">
          <Image
            src="/brand/wrb12-on-navy.webp"
            alt={OPENING.logoAlt}
            width={640}
            height={441}
            className="opening-logo"
            loading="eager"
          />
          <p className="opening-campaign">{OPENING.campaign}</p>
        </div>
        <div className="opening-art">
          <DotBrain ref={brainRef} label={OPENING.brainLabel} />
        </div>
        <div className="opening-copy">
          <h2>
            {OPENING.title[0]}
            <br />
            {OPENING.title[1]}
          </h2>
          <svg className="ecg" viewBox="0 0 1000 90" aria-hidden="true">
            <path pathLength={1} d={ECG} />
          </svg>
          <p className="opening-lead">{OPENING.lead}</p>
          <LiveCounter />
          <p className="cue">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {OPENING.cue}
          </p>
        </div>
      </div>
    </header>
  );
}
