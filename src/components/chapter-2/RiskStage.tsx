"use client";

import { gsap } from "gsap";
import { CHAPTER_2 } from "@/content/chapter-2";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { pickOther } from "@/lib/pick";
import { CROWD, PEOPLE_X, PEOPLE_Y, PERSON_SLOT, crowdOpacity, crowdZoom, personPose, redSlots, slotAt } from "@/lib/risk-crowd";
import { stepProgress } from "@/lib/steps";
import { RISK_KINDS, RiskIcon, type RiskKind } from "./RiskIcons";

const STARTS = CHAPTER_2.steps.map((s) => s.at);
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
/** Crowd slots that are not one of the four people (those four travel into their own slots). */
const EXTRA_SLOTS = Array.from({ length: CROWD }, (_, s) => s).filter((s) => !(PERSON_SLOT as readonly number[]).includes(s));
const FIGURE = "M-24,40 V0 C-24,-18 -14,-26 0,-26 C14,-26 24,-18 24,0 V40 Z";

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const people = Array.from(pin.querySelectorAll<SVGGElement>(".person"));
  const pulse = pin.querySelector<SVGPathElement>(".pulse")!;
  const icons = Array.from(pin.querySelectorAll<SVGGElement>(".risk-icon"));
  const crowd = Array.from(pin.querySelectorAll<SVGGElement>(".crowd"));
  let chosen = -1;
  let zoomWritten = -1;
  return {
    onStep(step) {
      if (step === 0) {
        // a different person each time the reader scrolls back here: "it could be anyone"
        chosen = pickOther(chosen, people.length);
        people.forEach((g, i) => g.classList.toggle("chosen", i === chosen));
        pulse.setAttribute("transform", pulseAt(chosen));
        if (!reduce) gsap.fromTo(pulse, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" });
        // 1 in 4 of the crowd is red, the chosen person among them
        const reds = redSlots(chosen);
        crowd.forEach((g) => g.classList.toggle("red", reds.includes(Number(g.dataset.slot))));
        zoomWritten = -1;
      }
      icons.forEach((g, i) => g.classList.toggle("focus", step >= FIRST_RISK_STEP && i === step - FIRST_RISK_STEP));
    },
    render(p, step) {
      // step 0: the four people zoom out into a crowd of forty
      const zoom = step === 0 ? crowdZoom(stepProgress(p, STARTS, 0), reduce) : 1;
      if (zoom !== zoomWritten) {
        zoomWritten = zoom;
        people.forEach((g, i) => {
          const pose = personPose(i, zoom);
          g.setAttribute("transform", `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) scale(${pose.scale.toFixed(3)})`);
        });
        crowd.forEach((g) => (g.style.opacity = crowdOpacity(Number(g.dataset.slot), zoom).toFixed(3)));
        pulse.style.opacity = String(1 - zoom);
      }
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
          <g key={x} className={i === 0 ? "person chosen" : "person"} transform={`translate(${x} ${PEOPLE_Y})`}>
            <circle cy="-46" r="16" />
            <path d={FIGURE} />
          </g>
        ))}
        {EXTRA_SLOTS.map((slot) => {
          const { x, y } = slotAt(slot);
          // server render: the four people alone; the scroll script fades the crowd in
          return (
            <g key={slot} className={redSlots(0).includes(slot) ? "crowd red" : "crowd"} data-slot={slot} transform={`translate(${x} ${y}) scale(.36)`} style={{ opacity: 0 }}>
              <circle cy="-46" r="16" />
              <path d={FIGURE} />
            </g>
          );
        })}
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
