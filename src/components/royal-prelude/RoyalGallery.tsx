"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROYAL_ASSETS } from "@/content/royal-prelude";
import { activeRoyalDuty } from "@/lib/royal-gallery";

const DESKTOP_GALLERY = "(min-width: 861px) and (min-height: 501px)";

export function RoyalGallery({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_GALLERY);
    let observer: IntersectionObserver | undefined;

    const updateMode = () => {
      observer?.disconnect();
      observer = undefined;

      if (
        !media.matches ||
        !rootRef.current ||
        typeof IntersectionObserver === "undefined"
      ) {
        setEnhanced(false);
        return;
      }

      const duties = [...rootRef.current.querySelectorAll<HTMLElement>("[data-royal-duty]")];
      const ratios = duties.map(() => 0);
      setEnhanced(true);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const index = duties.indexOf(entry.target as HTMLElement);
            if (index >= 0) ratios[index] = entry.intersectionRatio;
          }

          const next = activeRoyalDuty(ratios, activeRef.current);
          if (next !== activeRef.current) {
            activeRef.current = next;
            setActive(next);
          }
        },
        { rootMargin: "-18% 0px -18%", threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      duties.forEach((duty) => observer?.observe(duty));
    };

    updateMode();
    media.addEventListener("change", updateMode);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [enhanced]);

  const cycling = ROYAL_ASSETS.cycling;
  const running = ROYAL_ASSETS.running;

  return (
    <div
      id="royal-duties"
      className={`royal-duties royal-gallery${enhanced ? " is-enhanced" : ""}`}
      ref={rootRef}
    >
      <div className="royal-gallery-copy">{children}</div>
      <div className="royal-gallery-visual" aria-hidden="true">
        <div className={`royal-gallery-state${active === 0 ? " is-active" : ""}`}>
          <Image
            src={cycling.src}
            alt=""
            width={cycling.width}
            height={cycling.height}
            sizes="44vw"
          />
        </div>
        <div className={`royal-gallery-state${active === 1 ? " is-active" : ""}`}>
          <Image
            src={running.src}
            alt=""
            width={running.width}
            height={running.height}
            sizes="44vw"
          />
        </div>
        <div className={`royal-gallery-state royal-gallery-state--pair${active === 2 ? " is-active" : ""}`}>
          <Image
            src={cycling.src}
            alt=""
            width={cycling.width}
            height={cycling.height}
            sizes="22vw"
          />
          <Image
            src={running.src}
            alt=""
            width={running.width}
            height={running.height}
            sizes="22vw"
          />
        </div>
      </div>
    </div>
  );
}
