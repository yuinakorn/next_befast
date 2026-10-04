"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CLOSING } from "@/content/closing";
import { DotBrain, type DotBrainHandle } from "@/components/opening/DotBrain";
import { Phrases } from "@/components/ui/Phrases";
import { relit } from "@/lib/dot-brain";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The opening dims the brain down to this share of its dots; the closing lights it up again from here. */
const MIN_LIT = 0.15;

/**
 * The page ends on the campaign navy plate: the dot brain from the opening relights as the plate scrolls
 * into view, under the closing line. With reduced motion the brain is fully lit at once.
 */
export function ClosingPlate() {
  const rootRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<DotBrainHandle>(null);

  useGSAP(
    () => {
      const brain = brainRef.current;
      if (!brain) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        brain.setLit(1);
        return;
      }
      brain.setLit(MIN_LIT);
      ScrollTrigger.create({
        trigger: rootRef.current,
        // clamp(): the page may end before the plate reaches the end line (tall screens)
        start: "clamp(top 90%)",
        end: "clamp(top 30%)",
        scrub: true,
        onUpdate: (self) => brain.setLit(relit(self.progress, MIN_LIT)),
      });
    },
    { scope: rootRef },
  );

  return (
    <div className="closing-plate" ref={rootRef}>
      <div className="closing-plate-inner">
        <div className="closing-plate-art">
          <DotBrain ref={brainRef} />
        </div>
        <p className="closing-final">
          <Phrases text={CLOSING.final} />
        </p>
      </div>
    </div>
  );
}
