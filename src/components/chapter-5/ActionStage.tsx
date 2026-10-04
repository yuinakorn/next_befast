"use client";

import { CHAPTER_5, OUTCOMES } from "@/content/chapter-5";
import { StoryStage } from "@/components/ui/StoryStage";
import type { PinnedScene } from "@/hooks/usePinnedSteps";
import { groupOfDot, revealedPerGroup, type FillWindow } from "@/lib/outcome-grid";
import { stepProgress } from "@/lib/steps";

const STARTS = CHAPTER_5.steps.map((s) => s.at);
/** Steps 0–3 are the checklist; step 4 fills the 10×10 grid; step 5 keeps it, framed. */
const TODO_STEPS = 4;
const GRID_STEP = 4;
const COUNTS = OUTCOMES.map((o) => o.count);
const FILL_WINDOWS: readonly FillWindow[] = [[0, 0.2], [0.2, 0.5], [0.5, 0.9]];

const ROW_PITCH = 62;
const ROW_TOP = 64;
const rowCy = (i: number) => ROW_TOP + i * ROW_PITCH + 27;

const GRID_COLS = 10;
const CELL_W = 30;
const CELL_H = 22;
const GRID_X = 50;
const GRID_Y = 4;
const LEGEND_Y = 250;
const LEGEND_PITCH = 24;

const DOTS = Array.from({ length: 100 }, (_, i) => ({
  i,
  x: GRID_X + CELL_W / 2 + (i % GRID_COLS) * CELL_W,
  y: GRID_Y + CELL_H / 2 + Math.floor(i / GRID_COLS) * CELL_H,
  key: OUTCOMES[groupOfDot(i, COUNTS)].key,
}));

/** Digits (the number 1669) wear the numeral font; the rest of the sentence stays Anuphan. */
function WithNumerals({ text }: { text: string }) {
  return text.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? (
      <tspan key={i} className="c5-num">{part}</tspan>
    ) : (
      part
    ),
  );
}

function TodoIcon({ i }: { i: number }) {
  switch (i) {
    case 0: // phone showing 1669, with call arcs
      return (
        <g>
          <rect className="c5-ic-line c5-ic-surface" x="-14" y="-22" width="28" height="44" rx="6" />
          <path className="c5-ic-line" d="M-4,-16 H4" />
          <text className="c5-ic-num" y="5" textAnchor="middle">1669</text>
          <path className="c5-ic-alarm" d="M19,-10 Q25,-3 19,4 M23,-15 Q32,-3 23,9" />
        </g>
      );
    case 1: // clock and pen
      return (
        <g>
          <circle className="c5-ic-line c5-ic-surface" cx="-5" cy="-3" r="16" />
          <path className="c5-ic-line" d="M-5,-3 V-12 M-5,-3 L2,1" />
          <g transform="translate(13 9) rotate(45)">
            <rect className="c5-ic-fill" x="-3" y="-15" width="6" height="19" rx="1.5" />
            <path className="c5-ic-fill" d="M-3,5 L0,12 L3,5 Z" />
          </g>
        </g>
      );
    case 2: // person lying on their side
      return (
        <g>
          <path className="c5-ic-ground" d="M-24,13 H28" />
          <path className="c5-ic-leg" d="M10,4 H23 L28,-3" />
          <rect className="shirt" x="-10" y="-8" width="24" height="15" rx="7.5" />
          <circle className="skin" cx="-16" cy="-1" r="8" />
        </g>
      );
    default: // pill bottle and medication card
      return (
        <g>
          <g transform="translate(-9 0)">
            <rect className="c5-ic-line c5-ic-surface" x="-10" y="-8" width="20" height="26" rx="4" />
            <rect className="c5-ic-fill" x="-11" y="-17" width="22" height="9" rx="3" />
            <path className="c5-ic-line" d="M-5,3 H5 M-5,9 H5" />
          </g>
          <g transform="translate(15 5)">
            <rect className="c5-ic-line c5-ic-surface" x="-12" y="-10" width="24" height="20" rx="3" />
            <path className="c5-ic-line" d="M-7,-3 H7 M-7,3 H2" />
          </g>
        </g>
      );
  }
}

function setup(pin: HTMLElement, reduce: boolean): PinnedScene {
  const todos = Array.from(pin.querySelectorAll<SVGGElement>(".c5-todo"));
  const dots = Array.from(pin.querySelectorAll<SVGGElement>(".c5-dot"));
  const legend = Array.from(pin.querySelectorAll<SVGGElement>(".c5-legend-row"));
  let shown = -1;
  return {
    onStep(step) {
      todos.forEach((g, i) => {
        g.classList.toggle("done", step >= i);
        g.classList.toggle("current", step === i);
      });
    },
    render(p, step) {
      // reduced motion: the whole grid appears the moment step 4 starts
      const t = step < GRID_STEP ? 0 : step > GRID_STEP || reduce ? 1 : stepProgress(p, STARTS, GRID_STEP);
      const per = revealedPerGroup(t, COUNTS, FILL_WINDOWS);
      const n = per.reduce((a, b) => a + b, 0);
      if (n === shown) return;
      shown = n;
      dots.forEach((d, i) => d.classList.toggle("in", i < n));
      legend.forEach((row, g) => row.classList.toggle("in", per[g] > 0));
    },
  };
}

export function ActionStage() {
  const scene = (
    <svg className="story-svg c5-scene" viewBox="0 0 400 320" aria-hidden="true">
      <g className="c5-checklist">
        <g className="c5-clock" transform="translate(352 28)">
          <circle className="c5-clock-face" r="22" />
          <path className="c5-clock-mark" d="M0,-17 V-13 M17,0 H13 M0,17 V13 M-17,0 H-13" />
          <path className="c5-clock-hour" d="M0,0 L-7,-4" />
          <g className="c5-clock-sweep">
            <circle className="c5-clock-pivot" r="15" />
            <path className="c5-clock-hand" d="M0,0 V-15" />
          </g>
        </g>
        {Array.from({ length: TODO_STEPS }, (_, i) => (
          <g key={i} className={i === 0 ? "c5-todo done current" : "c5-todo"}>
            <rect className="c5-card" x="12" y={ROW_TOP + i * ROW_PITCH} width="310" height="54" rx="12" />
            <g transform={`translate(46 ${rowCy(i)})`}>
              <TodoIcon i={i} />
            </g>
            <text className="c5-todo-label" x="88" y={rowCy(i) + 6}>
              <WithNumerals text={CHAPTER_5.steps[i].title} />
            </text>
            <g transform={`translate(352 ${rowCy(i)})`}>
              <circle className="c5-box" r="14" />
              <path className="c5-tick" pathLength={1} d="M-7,0 L-2,6 L8,-6" />
            </g>
          </g>
        ))}
      </g>
      <g className="c5-outcomes">
        <rect className="c5-frame" x="40" y="-6" width="320" height="236" rx="14" />
        {DOTS.map((d) => (
          <g key={d.i} className="c5-dot" data-k={d.key} transform={`translate(${d.x} ${d.y})`}>
            <circle cy="-6" r="4.6" />
            <path d="M-6,9 V3.5 C-6,-0.5 -3.5,-1.5 0,-1.5 C3.5,-1.5 6,-0.5 6,3.5 V9 Z" />
          </g>
        ))}
        {OUTCOMES.map((o, g) => (
          <g key={o.key} className="c5-legend-row" data-k={o.key} transform={`translate(${GRID_X} ${LEGEND_Y + g * LEGEND_PITCH})`}>
            <circle className="c5-legend-dot" cx="10" r="8" />
            <text className="c5-legend-count" x="32" y="7">{o.count}</text>
            <text className="c5-legend-label" x="68" y="6">{o.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );

  return <StoryStage id="pin5" steps={CHAPTER_5.steps} scene={scene} setup={setup} />;
}
