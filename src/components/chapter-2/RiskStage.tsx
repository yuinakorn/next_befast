"use client";

import { gsap } from "gsap";
import { CHAPTER_2 } from "@/content/chapter-2";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { pickOther } from "@/lib/pick";
import { stepProgress } from "@/lib/steps";
import { RISK_KINDS, RiskIcon, type RiskKind } from "./RiskIcons";

const STARTS = CHAPTER_2.steps.map((s) => s.at);
const PEOPLE_X = [80, 160, 240, 320];
const ICONS_STEP = 1;
const FIRST_RISK_STEP = 2;
const ICON_AT: Record<RiskKind, readonly [number, number]> = {
  bp: [200, 52],
  lifestyle: [314, 110],
  smoke: [304, 236],
  stress: [96, 236],
  drugs: [86, 110],
};
const pulseAt = (i: number) => `translate(${PEOPLE_X[i] - 26} 82)`;

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const people = Array.from(pin.querySelectorAll<SVGGElement>(".person"));
  const pulse = pin.querySelector<SVGPathElement>(".pulse")!;
  const icons = Array.from(pin.querySelectorAll<SVGGElement>(".risk-icon"));
  let chosen = -1;
  return {
    onStep(step) {
      if (step === 0) {
        // a different person each time the reader scrolls back here: "it could be anyone"
        chosen = pickOther(chosen, people.length);
        people.forEach((g, i) => g.classList.toggle("chosen", i === chosen));
        pulse.setAttribute("transform", pulseAt(chosen));
        if (!reduce) gsap.fromTo(pulse, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" });
      }
      icons.forEach((g, i) => g.classList.toggle("focus", step >= FIRST_RISK_STEP && i === step - FIRST_RISK_STEP));
    },
    render(p, step) {
      const t = step < ICONS_STEP ? 0 : step > ICONS_STEP || reduce ? 1 : stepProgress(p, STARTS, ICONS_STEP);
      icons.forEach((g, i) => g.classList.toggle("in", t > i / icons.length));
    },
  };
}

export function RiskStage() {
  const scene = (
    <svg className="story-svg risk" viewBox="0 0 400 320" aria-hidden="true">
      <g className="people">
        {PEOPLE_X.map((x, i) => (
          <g key={x} className={i === 0 ? "person chosen" : "person"} transform={`translate(${x} 150)`}>
            <circle cy="-46" r="16" />
            <path d="M-24,40 V0 C-24,-18 -14,-26 0,-26 C14,-26 24,-18 24,0 V40 Z" />
          </g>
        ))}
        <path className="pulse" pathLength={1} strokeDasharray="1" d="M0,0 H14 L20,-12 L28,14 L34,-6 L38,0 H52" transform={pulseAt(0)} />
        <text className="risk-big" x="200" y="282" textAnchor="middle">
          <tspan className="risk-big-num">1</tspan>
          <tspan dx="10">ใน</tspan>
          <tspan dx="10" className="risk-big-num alarm">4</tspan>
        </text>
      </g>
      <g className="youth" transform="translate(200 170)">
        <circle className="youth-fill" cy="-40" r="18" />
        <path className="youth-fill" d="M-26,40 V-4 C-26,-16 -16,-20 0,-20 C16,-20 26,-16 26,-4 V40 Z" />
        <rect className="youth-fill" x="-20" y="36" width="16" height="56" rx="8" />
        <rect className="youth-fill" x="4" y="36" width="16" height="56" rx="8" />
      </g>
      {RISK_KINDS.map((k) => (
        <g key={k} className="risk-icon" data-k={k} transform={`translate(${ICON_AT[k][0]} ${ICON_AT[k][1]})`}>
          <g className="risk-icon-inner">
            <circle className="ri-badge" r="30" />
            <RiskIcon kind={k} />
          </g>
        </g>
      ))}
    </svg>
  );

  return <StoryStage id="pin2" steps={CHAPTER_2.steps} scene={scene} setup={setup} />;
}
