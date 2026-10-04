"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { activeStep } from "@/lib/steps";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type PinnedScene = {
  /** Every scroll update: overall progress (0–1) and the active step index. */
  render?: (progress: number, step: number) => void;
  /** When the active step changes; `prev` is -1 on the first call. */
  onStep?: (step: number, prev: number) => void;
  cleanup?: () => void;
};

type Options = {
  /** Progress (0–1) at which each `.step` becomes active, in DOM order. */
  starts: readonly number[];
  /** ScrollTrigger end, e.g. "+=600%". */
  end: string;
  setup: (pin: HTMLElement, reduce: boolean) => PinnedScene;
};

/**
 * Pins `pinRef` while the reader scrolls `end`, shows one `.step` at a time, writes the
 * active index to `data-step` on the pin (for CSS scene states) and forwards progress to
 * the chapter scene. Same mechanics as BrainClock (chapter 3).
 */
export function usePinnedSteps(pinRef: RefObject<HTMLElement | null>, { starts, end, setup }: Options) {
  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const steps = Array.from(pin.querySelectorAll<HTMLElement>(".step"));
      const scene = setup(pin, reduce);
      let cur = -1;

      const update = (p: number) => {
        const idx = activeStep(p, starts);
        if (idx !== cur) {
          steps.forEach((s, j) => s.classList.toggle("on", j === idx));
          pin.dataset.step = String(idx);
          scene.onStep?.(idx, cur);
          cur = idx;
        }
        scene.render?.(p, idx);
      };

      document.documentElement.classList.add("anim");
      ScrollTrigger.config({ ignoreMobileResize: true });
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end, pin: true, scrub: 0.6, anticipatePin: 1 },
        onUpdate: () => update(proxy.p),
      });
      update(0);
      return () => scene.cleanup?.();
    },
    { scope: pinRef },
  );
}
