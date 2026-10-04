"use client";

import { useState } from "react";
import { CHAPTER_1 } from "@/content/chapter-1";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { BRAIN_PATH } from "@/lib/dot-brain";
import { BLEED_AT, CLOT_T, DISTRICTS, LABELS, QUEUE_AT, ROADS, cityLights, pointOnRoad, roadD, type DistrictId } from "@/lib/brain-city";
import { stepProgress } from "@/lib/steps";
import { TypeToggle, type StrokeType } from "./TypeToggle";

const STARTS = CHAPTER_1.steps.map((s) => s.at);
const LIGHTS = cityLights();
const DISTRICT_IDS = Object.keys(DISTRICTS) as DistrictId[];
const CLOT_STEP = 3, BLEED_STEP = 4, TOGGLE_STEP = 5;
const CAPTIONS: Record<StrokeType, string> = {
  clot: CHAPTER_1.steps[CLOT_STEP].body ?? "",
  bleed: CHAPTER_1.steps[BLEED_STEP].body ?? "",
};
const BLOB = "M0,-14 C9,-14 16,-6 15,3 C14,12 6,17 -3,16 C-12,15 -17,6 -15,-3 C-13,-11 -7,-14 0,-14 Z";
const fmt = (n: number) => n.toFixed(1);

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const clot = pin.querySelector<SVGCircleElement>(".clot")!;
  const bleed = pin.querySelector<SVGPathElement>(".bleed")!;
  const weight = pin.querySelector<HTMLElement>('[data-stat="weight"]')!;
  const oxygen = pin.querySelector<HTMLElement>('[data-stat="oxygen"]')!;
  return {
    render(p, step) {
      // stats settle at 2% / 20% by halfway through step 0, so they read right while the headline is up
      const s0 = reduce ? 1 : Math.min(1, stepProgress(p, STARTS, 0) / 0.5);
      weight.textContent = `${Math.round(2 * s0)}%`;
      oxygen.textContent = `${Math.round(20 * s0)}%`;
      // clot drifts up the frontal road during the first 60% of its step, then sticks
      const travel = step === CLOT_STEP && !reduce ? Math.min(1, stepProgress(p, STARTS, CLOT_STEP) / 0.6) : 1;
      const [cx, cy] = pointOnRoad(ROADS.frontal, CLOT_T * travel);
      clot.setAttribute("transform", `translate(${fmt(cx)} ${fmt(cy)})`);
      const grow = step === BLEED_STEP && !reduce ? Math.min(1, stepProgress(p, STARTS, BLEED_STEP) / 0.5) : 1;
      bleed.setAttribute("transform", `translate(${fmt(BLEED_AT[0])} ${fmt(BLEED_AT[1])}) scale(${(0.2 + 0.8 * grow).toFixed(2)})`);
    },
  };
}

export function BrainCity() {
  const [focus, setFocus] = useState<StrokeType | null>(null);

  const scene = (
    <>
      <svg className="story-svg city" viewBox="0 0 400 320" aria-hidden="true" data-focus={focus ?? ""}>
        <defs>
          <clipPath id="cityClip"><path d={BRAIN_PATH} /></clipPath>
          <linearGradient id="scanGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: "var(--cath)", stopOpacity: 0 }} />
            <stop offset=".5" style={{ stopColor: "var(--cath)", stopOpacity: 0.35 }} />
            <stop offset="1" style={{ stopColor: "var(--cath)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path className="city-base" d={BRAIN_PATH} />
        <g clipPath="url(#cityClip)">
          {DISTRICT_IDS.map((id) => (
            <polygon key={id} className="district" data-d={id} points={DISTRICTS[id].map((pt) => pt.join(",")).join(" ")} />
          ))}
          {LIGHTS.map((l) => (
            <rect key={`${l.x},${l.y}`} className="light" data-d={l.district} x={l.x - 3} y={l.y - 3} width="6" height="6" rx="1.5" />
          ))}
        </g>
        {Object.entries(ROADS).map(([id, road]) => (
          <g key={id} className="road" data-road={id}>
            <path className="road-bed" d={roadD(road)} />
            <path className="road-flow" d={roadD(road)} />
          </g>
        ))}
        <g className="queue">
          {QUEUE_AT.map(([x, y]) => <circle key={x} cx={fmt(x)} cy={fmt(y)} r="4.5" />)}
        </g>
        <circle className="clot" r="7" transform={`translate(${ROADS.frontal.from.join(" ")})`} />
        <path className="bleed" d={BLOB} transform={`translate(${fmt(BLEED_AT[0])} ${fmt(BLEED_AT[1])})`} />
        <g className="city-labels">
          {LABELS.map((l) => <text key={l.text} className="city-label" x={l.at[0]} y={l.at[1]}>{l.text}</text>)}
        </g>
        <g className="split">
          <line className="split-line" x1="210" y1="14" x2="210" y2="306" />
          <text className="split-label" x="110" y="22" textAnchor="middle">ตัน</text>
          <text className="split-label" x="310" y="22" textAnchor="middle">แตก</text>
          <rect className="scan" x="50" y="30" width="28" height="250" />
        </g>
        <rect className="focus-mask" data-side="left" x="0" y="0" width="210" height="320" />
        <rect className="focus-mask" data-side="right" x="210" y="0" width="190" height="320" />
        <g className="tia-warn" transform="translate(262 4)">
          <path d="M14,0 L28,26 H0 Z" />
          <text x="14" y="23" textAnchor="middle">!</text>
        </g>
      </svg>
      <div className="city-stats" aria-hidden="true">
        <p><span className="city-stat-num" data-stat="weight">2%</span><span>ของน้ำหนักตัว</span></p>
        <p><span className="city-stat-num alarm" data-stat="oxygen">20%</span><span>ของออกซิเจนทั้งร่างกาย</span></p>
      </div>
    </>
  );

  return (
    <StoryStage
      id="pin1"
      steps={CHAPTER_1.steps}
      scene={scene}
      setup={setup}
      stepExtra={(i) => (i === TOGGLE_STEP ? <TypeToggle value={focus} onChange={setFocus} captions={CAPTIONS} /> : null)}
    />
  );
}
