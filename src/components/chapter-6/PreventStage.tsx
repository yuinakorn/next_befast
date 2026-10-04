"use client";

import { useId } from "react";
import { CHAPTER_6, DISEASES } from "@/content/chapter-6";
import { StoryStage } from "@/components/ui/StoryStage";
import { ShieldShape } from "@/components/ui/Shield";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { countUp, cubicPoint, piecesLit, roughRing, windowProgress, type Point } from "@/lib/prevent-scene";
import { SHIELD_DISEASE_COUNT, setShieldLit } from "@/lib/shield";
import { stepProgress } from "@/lib/steps";

const STARTS = CHAPTER_6.steps.map((s) => s.at);

/** Step indexes (0-based, as in CHAPTER_6.steps and `#pin6[data-step]`). */
const STEP_COUNT = 0; // 90% counts up, an empty shield appears
const STEP_DISEASES = 2; // 2..5: one disease each, in DISEASES order
const STEP_DIABETES = 2;
const STEP_PLAQUE = 4;
const STEP_RHYTHM = 5;
const STEP_ASSEMBLE = 6; // the first 4 shield pieces light up

/** The number in the step-0 title ("... ถึง 90%"), so the count-up always ends on the copy's figure. */
const TARGET = Number(/\d+/.exec(CHAPTER_6.steps[0].title)?.[0] ?? 90);
/** Share of step 0's scroll over which the number climbs; the rest lets it rest on the final figure. */
const COUNT_WINDOW = [0, 0.8] as const;
/** Within a disease step: the vessel stays healthy until this share, then shows the damage. */
const SICK_AT = 0.25;
const PLAQUE_WINDOW = [0.1, 0.85] as const;
const CLOT_WINDOW = [0.15, 0.85] as const;
const ASSEMBLE_WINDOW = [0.08, 0.8] as const;

/* ---- vessel cross-section (centre of the vessel group in scene units) ---- */
const VESSEL = { x: 210, y: 178 };
const WALL_R = 84;
const LUMEN_R = 56;
const ROUGH_LUMEN = roughRing(43, 5, 44);
/** Plaque is a big rough blob whose centre sits in the wall; the lumen clip leaves a crescent that grows. */
const PLAQUE_BLOB = roughRing(90, 5, 36);
const PLAQUE_ORIGIN_Y = 80;
const ARROWS = Array.from({ length: 8 }, (_, k) => k * 45);

/* ---- heart → brain route for atrial fibrillation ---- */
const HEART = { x: 92, y: 232 };
const ROUTE: [Point, Point, Point, Point] = [
  { x: 120, y: 212 },
  { x: 230, y: 236 },
  { x: 170, y: 120 },
  { x: 304, y: 118 },
];
const ROUTE_D = `M${ROUTE[0].x},${ROUTE[0].y} C${ROUTE[1].x},${ROUTE[1].y} ${ROUTE[2].x},${ROUTE[2].y} ${ROUTE[3].x},${ROUTE[3].y}`;
const BRAIN = { x: 334, y: 92 };
/** An uneven rhythm strip: the gaps between beats differ. */
const BEATS = [58, 112, 142, 226, 256, 322];
const ECG_D =
  `M26,298 ` +
  BEATS.map((x) => `L${x - 10},298 L${x - 6},294 L${x - 3},298 L${x},282 L${x + 3},308 L${x + 6},298`).join(" ") +
  ` L374,298`;

const HEART_D = "M0,26 C-42,0 -36,-34 -12,-34 C-4,-34 0,-27 0,-24 C0,-27 4,-34 12,-34 C36,-34 42,0 0,26 Z";
const BRAIN_D =
  "M-6,-32 C-18,-38 -34,-34 -38,-22 C-50,-20 -54,-4 -46,4 C-52,14 -46,28 -34,28 C-30,38 -12,40 -6,30 " +
  "C0,38 16,38 20,28 C32,34 46,26 44,14 C54,8 54,-8 44,-14 C44,-28 30,-36 18,-30 C12,-36 0,-36 -6,-32 Z";
const BRAIN_FOLDS =
  "M-1,-33 C4,-18 -4,-6 1,6 C5,16 -2,24 1,35 M-32,-10 C-24,-18 -16,-12 -20,-4 M-34,14 C-26,6 -18,14 -14,8 " +
  "M14,-14 C22,-20 30,-14 26,-6 M16,14 C24,8 32,16 36,8";

/** Shared by both states of the scene: pieces of a number written in the numeral font. */
function CountedLabel({ text }: { text: string }) {
  return text.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? (
      <tspan key={i} className="c6-num">{part}</tspan>
    ) : (
      part
    ),
  );
}

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const svg = pin.querySelector<SVGSVGElement>(".c6-scene")!;
  const countEl = pin.querySelector<SVGTextElement>(".c6-count")!;
  const arcs = Array.from(pin.querySelectorAll<SVGElement>(".c6-arc"));
  const vessel = pin.querySelector<SVGGElement>(".c6-vessel")!;
  const plaque = pin.querySelector<SVGPathElement>(".c6-plaque")!;
  const clot = pin.querySelector<SVGCircleElement>(".c6-clot")!;
  const brain = pin.querySelector<SVGGElement>(".c6-brain")!;
  const shield = pin.querySelector<SVGGElement>(".c6-shield-wrap")!;
  const pieces = Array.from(shield.querySelectorAll<SVGElement>(".shield-piece"));

  // last written values: write to the DOM only when something changed
  let count = -1;
  let sick: boolean | null = null;
  let grow = -1;
  let travel = -1;
  let lit = -1;

  return {
    onStep(step) {
      // the slot of the disease being explained is marked on the small shield
      pieces.forEach((el, i) => el.classList.toggle("cur", step >= STEP_DISEASES && step <= STEP_RHYTHM && i === step - STEP_DISEASES));
    },
    render(p, step) {
      const t = stepProgress(p, STARTS, step);

      // step 0: the figure climbs and the accent turns from alarm red to calm teal
      const n = step > STEP_COUNT || reduce ? TARGET : countUp(t, TARGET, ...COUNT_WINDOW);
      if (n !== count) {
        count = n;
        countEl.textContent = String(n);
        svg.style.setProperty("--c6-calm", String(n / TARGET));
        arcs.forEach((a) => (a.style.strokeDashoffset = String(100 - n)));
      }

      // steps 2–4: a healthy vessel first, then the damage (immediately when motion is reduced)
      const damaged = reduce || (step >= STEP_DIABETES && step <= STEP_PLAQUE && t > SICK_AT);
      if (damaged !== sick) {
        sick = damaged;
        vessel.classList.toggle("sick", damaged);
      }

      // step 4: plaque builds up as the reader scrolls
      const g = step < STEP_PLAQUE ? 0 : step > STEP_PLAQUE || reduce ? 1 : windowProgress(t, ...PLAQUE_WINDOW);
      if (g !== grow) {
        grow = g;
        plaque.style.transform = `translate(0px, ${PLAQUE_ORIGIN_Y}px) scale(${Math.max(g, 0.001).toFixed(3)})`;
      }

      // step 5: a clot leaves the heart and travels to the brain
      const tt = step < STEP_RHYTHM ? 0 : step > STEP_RHYTHM || reduce ? 1 : windowProgress(t, ...CLOT_WINDOW);
      const tq = Math.round(tt * 200) / 200;
      if (tq !== travel) {
        travel = tq;
        const pt = cubicPoint(ROUTE[0], ROUTE[1], ROUTE[2], ROUTE[3], tq);
        clot.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        clot.classList.toggle("on", step === STEP_RHYTHM && (reduce || tq > 0));
        brain.classList.toggle("hit", step === STEP_RHYTHM && tq >= 1);
      }

      // step 6: the 4 disease pieces light one after another
      const l = step < STEP_ASSEMBLE ? 0 : reduce ? SHIELD_DISEASE_COUNT : piecesLit(t, SHIELD_DISEASE_COUNT, ...ASSEMBLE_WINDOW);
      if (l !== lit) {
        lit = l;
        setShieldLit(shield, l);
      }
    },
  };
}

export function PreventStage() {
  const clipId = `c6-lumen-clip-${useId().replace(/:/g, "")}`;

  const scene = (
    <svg className="story-svg c6-scene" viewBox="0 0 400 320" aria-hidden="true">
      {/* step 0: the 90% gauge */}
      <g className="c6-hero">
        <g transform="translate(118 160) rotate(-90)">
          <circle className="c6-gauge-track" r="84" />
          <circle className="c6-arc c6-arc-alarm" r="84" pathLength={100} style={{ strokeDashoffset: 100 - TARGET }} />
          <circle className="c6-arc c6-arc-calm" r="84" pathLength={100} style={{ strokeDashoffset: 100 - TARGET }} />
        </g>
        <text className="c6-count" x="146" y="186" textAnchor="end">{TARGET}</text>
        <text className="c6-pct" x="152" y="186">%</text>
      </g>

      {/* the shield moves between three places: beside the gauge, centred, and small in the corner */}
      <g className="c6-shield-wrap">
        <ShieldShape />
      </g>
      <g className="c6-slot-labels">
        <text className="c6-slot-label" x="112" y="94" textAnchor="end"><CountedLabel text="4 โรค" /></text>
        <text className="c6-slot-label" x="292" y="190"><CountedLabel text="6 พฤติกรรม" /></text>
      </g>

      {/* steps 2–5: which disease */}
      <g className="c6-labels">
        {DISEASES.map((name, i) => (
          <text key={name} className="c6-label" data-d={i} x="88" y="48">{name}</text>
        ))}
      </g>

      {/* steps 2–4: vessel cross-section */}
      <g className="c6-vessel" transform={`translate(${VESSEL.x} ${VESSEL.y})`}>
        <g className="c6-throb">
          <clipPath id={clipId}>
            <circle r={LUMEN_R} />
          </clipPath>
          <circle className="c6-wall" r={WALL_R} />
          <circle className="c6-lumen c6-lumen-fill" r={LUMEN_R} />
          <path className="c6-rough" d={ROUGH_LUMEN} />
          <g clipPath={`url(#${clipId})`}>
            <path className="c6-plaque" d={PLAQUE_BLOB} style={{ transform: `translate(0px, ${PLAQUE_ORIGIN_Y}px) scale(0.001)` }} />
          </g>
          <circle className="c6-lumen c6-lumen-edge" r={LUMEN_R} />
          <g className="c6-arrows">
            {ARROWS.map((a) => (
              <path key={a} d="M0,-18 V-38 M-6,-32 L0,-40 L6,-32" transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
      </g>

      {/* step 5: irregular heartbeat, clot, brain */}
      <g className="c6-af">
        <path className="c6-ecg" d={ECG_D} />
        <path className="c6-tube-edge" d={ROUTE_D} />
        <path className="c6-tube" d={ROUTE_D} />
        <g className="c6-brain" transform={`translate(${BRAIN.x} ${BRAIN.y})`}>
          <path className="c6-brain-body" d={BRAIN_D} />
          <circle className="c6-brain-hit" cx="-26" cy="22" r="16" />
          <path className="c6-brain-folds" d={BRAIN_FOLDS} />
        </g>
        <g transform={`translate(${HEART.x} ${HEART.y})`}>
          <g className="c6-heart">
            <path className="c6-heart-body" d={HEART_D} />
            <path className="c6-heart-wave" d="M-22,-8 L-15,3 L-9,-11 L-3,5 L4,-13 L10,3 L16,-8 L23,0" />
          </g>
        </g>
        <circle className="c6-clot" r="10" transform={`translate(${ROUTE[0].x} ${ROUTE[0].y})`} />
      </g>
    </svg>
  );

  return <StoryStage id="pin6" steps={CHAPTER_6.steps} scene={scene} setup={setup} />;
}
