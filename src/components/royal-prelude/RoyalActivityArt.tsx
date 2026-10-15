"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function RoyalActivityArt() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".royal-activity-people-image",
          { autoAlpha: 0.7, y: 28, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <figure ref={root} className="royal-activity-people">
      <Image
        className="royal-activity-people-image"
        src="/royal/activity-community.webp"
        alt="ผู้ร่วมกิจกรรมเดิน วิ่ง และปั่นจักรยานชวนกันเข้าร่วมกิจกรรม"
        width={1536}
        height={1024}
        sizes="(max-width: 699px) 100vw, (max-width: 860px) 78vw, 620px"
      />
    </figure>
  );
}
