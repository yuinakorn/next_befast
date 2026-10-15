"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ClosingSurveyJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 84%",
            once: true,
          },
        });

        timeline
          .fromTo(
            ".closing-survey-journey-image",
            { autoAlpha: 0.72, y: 24, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          )
          .fromTo(
            ".closing-survey-milestone",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.1, ease: "power2.out" },
            "-=0.35",
          );
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="closing-survey-journey">
      <figure>
        <Image
          className="closing-survey-journey-image"
          src="/illustrations/closing-survey-journey.webp"
          alt=""
          aria-hidden="true"
          width={1774}
          height={887}
          sizes="(max-width: 699px) calc(100vw + 32px), (max-width: 860px) 720px, 620px"
        />
        <figcaption className="closing-survey-milestones">
          <span className="closing-survey-milestone">เรียนรู้แล้ว</span>
          <span className="closing-survey-milestone">ก้าวต่ออีกนิด</span>
          <span className="closing-survey-milestone">ช่วยบอกเราว่าเป็นอย่างไร</span>
        </figcaption>
      </figure>
    </div>
  );
}
