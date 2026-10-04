"use client";

import Image from "next/image";
import { useState } from "react";
import { CHAPTER_1 } from "@/content/chapter-1";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { BLEED_AT, CITY_BRAIN_PATH, CLOT_T, LABELS, QUEUE_AT, ROADS, pointOnRoad, roadD } from "@/lib/brain-city";
import { stepProgress } from "@/lib/steps";
import { TypeToggle, type StrokeType } from "./TypeToggle";

const STARTS = CHAPTER_1.steps.map((s) => s.at);
const CLOT_STEP = 3, BLEED_STEP = 4, TOGGLE_STEP = 5;
const CAPTIONS: Record<StrokeType, string> = {
  clot: CHAPTER_1.steps[CLOT_STEP].body ?? "",
  bleed: CHAPTER_1.steps[BLEED_STEP].body ?? "",
};
const BLOB = "M-2,-18 L4,-9 L14,-14 L12,-4 L24,-1 L13,5 L19,14 L7,12 L2,24 L-4,13 L-15,18 L-13,7 L-25,3 L-13,-3 L-18,-12 L-7,-10 Z";
const BLEED_DOTS = [[-17, -11, 3], [18, -9, 4], [-22, 9, 3], [20, 11, 3], [-4, 23, 3]] as const;
const LEFT_ZONE = "M25,70 C65,42 118,40 150,72 C132,103 126,140 139,170 C148,193 171,210 190,224 C180,247 176,276 185,308 C122,322 61,292 35,242 C15,203 13,122 25,70 Z";
const RIGHT_ZONE = "M375,70 C335,42 282,40 250,72 C268,103 274,140 261,170 C252,193 229,210 210,224 C220,247 224,276 215,308 C278,322 339,292 365,242 C385,203 387,122 375,70 Z";
const fmt = (n: number) => n.toFixed(1);
const y300 = (n: number) => fmt(n * (5 / 6));

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const clot = pin.querySelector<SVGCircleElement>(".clot")!;
  const bleed = pin.querySelector<SVGGElement>(".bleed-mark")!;
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
    <div className="city-board">
      <div className="city-visual">
        <Image
          className="city-base-image"
          src="/illustrations/chapter-1-brain-base.webp"
          alt=""
          width={1448}
          height={1086}
          sizes="(max-width: 860px) calc(100vw - 32px), 55vw"
          draggable={false}
        />
        <svg className="city" viewBox="0 0 400 300" role="img" aria-labelledby="city-title" data-focus={focus ?? ""}>
          <title id="city-title">แผนภาพสมองที่มีหลอดเลือดเป็นเส้นทางส่งเลือดไปเลี้ยงเซลล์</title>
          <defs>
            <clipPath id="cityClip"><path d={CITY_BRAIN_PATH} /></clipPath>
            <filter id="bleedSoftShadow" x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <g className="city-geometry" transform="scale(1 .833333)">
            <path className="city-outline" d="M190,238 C190,282 188,326 192,356 L208,356 C212,326 210,282 210,238" />
            <path className="city-outline" d={CITY_BRAIN_PATH} />
            <g clipPath="url(#cityClip)">
              <path className="affected-zone" data-side="left" d={LEFT_ZONE} />
              <path className="affected-zone" data-side="right" d={RIGHT_ZONE} />
            </g>
            {Object.entries(ROADS).map(([id, road]) => (
              <g key={id} className="road" data-road={id}>
                <path className="road-flow" d={roadD(road)} />
              </g>
            ))}
            <g className="queue">
              {QUEUE_AT.map(([x, y]) => <circle key={x} cx={fmt(x)} cy={fmt(y)} r="4.5" />)}
            </g>
            <circle className="clot" r="8.4" transform={`translate(${ROADS.frontal.from.join(" ")})`} />
            <g className="bleed-mark" transform={`translate(${fmt(BLEED_AT[0])} ${fmt(BLEED_AT[1])})`}>
              <path className="bleed-shadow" d={BLOB} transform="scale(1.45)" filter="url(#bleedSoftShadow)" />
              <path className="bleed" d={BLOB} />
              {BLEED_DOTS.map(([cx, cy, r]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} />)}
            </g>
            <rect className="focus-mask" data-side="left" x="0" y="0" width="200" height="330" clipPath="url(#cityClip)" />
            <rect className="focus-mask" data-side="right" x="200" y="0" width="200" height="330" clipPath="url(#cityClip)" />
          </g>
          <g className="city-labels">
            {LABELS.map((l) => <text key={l.text} className="city-label" x={l.at[0]} y={y300(l.at[1])}>{l.text}</text>)}
          </g>
          <g className="split">
            <line className="split-line" x1="200" y1="18" x2="200" y2="290" />
            <g className="split-tag">
              <rect x="56" y="13" width="66" height="28" rx="14" />
              <text className="split-label" x="89" y="33" textAnchor="middle">ตัน</text>
              <line className="split-leader" x1="89" y1="41" x2="89" y2="77" />
              <circle className="split-pin" cx="89" cy="80" r="4" />
            </g>
            <g className="split-tag">
              <rect x="278" y="13" width="66" height="28" rx="14" />
              <text className="split-label" x="311" y="33" textAnchor="middle">แตก</text>
              <line className="split-leader" x1="311" y1="41" x2="311" y2="77" />
              <circle className="split-pin" cx="311" cy="80" r="4" />
            </g>
            <rect className="scan" x="39" y="68" width="10" height="170" rx="5" />
          </g>
          <g className="tia-warn" transform="translate(275 44)">
            <path d="M14,0 L28,26 H0 Z" />
            <text x="14" y="23" textAnchor="middle">!</text>
          </g>
        </svg>
      </div>
      <div className="city-rail">
        <div className="city-stats" aria-hidden="true">
          <p><span className="city-stat-num" data-stat="weight">2%</span><span>ของน้ำหนักตัว</span></p>
          <p><span className="city-stat-num alarm" data-stat="oxygen">20%</span><span>ของออกซิเจนทั้งร่างกาย</span></p>
        </div>
        <ul className="city-legend" aria-label="สัญลักษณ์ในภาพ">
          <li><span className="legend-dot legend-dot--cell" aria-hidden="true" />เซลล์สมอง</li>
          <li><span className="legend-dot legend-dot--affected" aria-hidden="true" />เลือดไปไม่ถึง</li>
          <li><span className="legend-dot legend-dot--clot" aria-hidden="true" />ลิ่มเลือด</li>
          <li><span className="legend-bleed" aria-hidden="true"><i /><i /><i /></span>เลือดรั่ว</li>
        </ul>
      </div>
    </div>
  );

  return (
    <StoryStage
      id="pin1"
      steps={CHAPTER_1.steps}
      scene={scene}
      setup={setup}
      showStepProgress
      stepExtra={(i) => (i === TOGGLE_STEP ? <TypeToggle value={focus} onChange={setFocus} captions={CAPTIONS} /> : null)}
    />
  );
}
